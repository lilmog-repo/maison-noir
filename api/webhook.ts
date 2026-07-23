import Stripe from 'stripe';
import { getSupabaseAdmin } from './_lib/supabaseAdmin';

const STRIPE_API_VERSION = '2026-06-24.dahlia' as Stripe.LatestApiVersion;

// IMPORTANT: this handler must read the RAW request body via request.text(),
// never request.json(). Stripe computes its webhook signature over the exact
// bytes it sent; if anything parses/re-serializes the body first, the byte
// sequence changes and signature verification fails. This is the single most
// common Stripe-webhook-on-serverless bug — see api/checkout.ts's sibling
// concerns for how the two endpoints differ in this respect.

export default {
  async fetch(request: Request) {
    if (request.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }

    const secretKey = process.env.STRIPE_SECRET_KEY;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!secretKey || !webhookSecret) {
      console.error('webhook: STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET not set');
      return Response.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    const signature = request.headers.get('stripe-signature');
    if (!signature) {
      return Response.json({ error: 'Missing stripe-signature header' }, { status: 400 });
    }

    const rawBody = await request.text();

    const stripe = new Stripe(secretKey, { apiVersion: STRIPE_API_VERSION });

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch (err) {
      console.error('webhook: signature verification failed', err);
      return Response.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // Idempotency: Stripe can and does send the same event more than once
    // (retries on timeout, etc). Record the event id first; if it's already
    // there, we've handled it before — acknowledge and stop, don't reprocess.
    const { error: insertEventError } = await supabase
      .from('webhook_events')
      .insert({ id: event.id, type: event.type });

    if (insertEventError) {
      // Unique violation on `id` means we've already processed this event.
      if (insertEventError.code === '23505') {
        return Response.json({ received: true, duplicate: true });
      }
      console.error('webhook: failed to record event', insertEventError);
      return Response.json({ error: 'Failed to record event' }, { status: 500 });
    }

    try {
      switch (event.type) {
        case 'checkout.session.completed':
        case 'checkout.session.async_payment_succeeded': {
          const session = event.data.object as Stripe.Checkout.Session;
          const orderId = session.metadata?.order_id;
          if (!orderId) {
            console.error('webhook: checkout session has no order_id in metadata', session.id);
            break;
          }

          const shipping = session.collected_information?.shipping_details;

          await supabase
            .from('orders')
            .update({
              status: 'paid',
              stripe_payment_intent_id:
                typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id,
              customer_email: session.customer_details?.email ?? null,
              customer_name: session.customer_details?.name ?? shipping?.name ?? null,
              shipping_address: shipping?.address ?? null,
              total_cents: session.amount_total ?? undefined,
              updated_at: new Date().toISOString(),
            })
            .eq('id', orderId);

          // Decrement inventory now that payment is confirmed.
          const { data: items } = await supabase
            .from('order_items')
            .select('product_id, size, color_name, quantity')
            .eq('order_id', orderId);

          for (const item of items ?? []) {
            if (!item.product_id) continue;
            await supabase.rpc('decrement_inventory', {
              p_product_id: item.product_id,
              p_size: item.size,
              p_color_name: item.color_name,
              p_quantity: item.quantity,
            });
          }
          break;
        }

        case 'checkout.session.expired': {
          const session = event.data.object as Stripe.Checkout.Session;
          const orderId = session.metadata?.order_id;
          if (orderId) {
            await supabase.from('orders').update({ status: 'cancelled' }).eq('id', orderId).eq('status', 'pending');
          }
          break;
        }

        default:
          // Other event types are ignored intentionally — we only act on the ones above.
          break;
      }
    } catch (err) {
      console.error('webhook: error processing event', event.type, err);
      return Response.json({ error: 'Error processing event' }, { status: 500 });
    }

    return Response.json({ received: true });
  },
};
