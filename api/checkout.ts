import Stripe from 'stripe';
import { getSupabaseAdmin } from './_lib/supabaseAdmin';

// Pin the API version explicitly rather than relying on the account default,
// per Stripe's own guidance — keeps response shapes matching the SDK's types.
const STRIPE_API_VERSION = '2026-06-24.dahlia' as Stripe.LatestApiVersion;

interface CheckoutLineItemRequest {
  productId: string;
  size: string;
  colorName: string;
  quantity: number;
}

interface CheckoutRequestBody {
  items: CheckoutLineItemRequest[];
}

const MAX_QUANTITY_PER_LINE = 20; // sanity ceiling, not a real business rule — just guards against abuse

function badRequest(message: string) {
  return Response.json({ error: message }, { status: 400 });
}

export default {
  async fetch(request: Request) {
    // TEMPORARY DIAGNOSTIC: wrapping everything in one outer try/catch that
    // returns the real error directly in the HTTP response body, rather than
    // relying on console.log/Vercel's log capture — which has documented,
    // real cases of silently dropping output even when a function completes
    // successfully. This bypasses that entirely: whatever actually happens
    // will show up in the response itself, visible in the browser network
    // tab / on the checkout page, no log pipeline involved.
    try {
      return await handleCheckout(request);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      const stack = err instanceof Error ? err.stack : undefined;
      return Response.json(
        { error: 'DIAGNOSTIC: unhandled exception in checkout function', message, stack },
        { status: 500 }
      );
    }
  },
};

async function handleCheckout(request: Request) {
    console.log('checkout: request received', request.method);

    if (request.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }

    const secretKey = process.env.STRIPE_SECRET_KEY;
    console.log('checkout: STRIPE_SECRET_KEY present?', !!secretKey);
    if (!secretKey) {
      console.error('checkout: STRIPE_SECRET_KEY is not set');
      return Response.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    // Accounts are required to purchase. Verify the request's bearer token
    // against Supabase directly with getUser() — NOT getSession(), which
    // only reads local/unvalidated claims and is explicitly documented by
    // Supabase as insecure for server-side authorization checks.
    const authHeader = request.headers.get('authorization');
    const accessToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    console.log('checkout: accessToken present?', !!accessToken);
    if (!accessToken) {
      return Response.json({ error: 'Sign in required.' }, { status: 401 });
    }

    console.log('checkout: VITE_SUPABASE_URL present?', !!process.env.VITE_SUPABASE_URL);
    console.log('checkout: SUPABASE_SECRET_KEY present?', !!process.env.SUPABASE_SECRET_KEY);

    let supabase;
    try {
      supabase = getSupabaseAdmin();
      console.log('checkout: getSupabaseAdmin() succeeded');
    } catch (err) {
      console.error('checkout: getSupabaseAdmin() threw', err);
      return Response.json({ error: 'Server misconfiguration (admin client)' }, { status: 500 });
    }

    console.log('checkout: calling supabase.auth.getUser()...');
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(accessToken);
    console.log('checkout: getUser() returned', { hasUser: !!user, authError: authError?.message });

    if (authError || !user) {
      return Response.json({ error: 'Sign in required.' }, { status: 401 });
    }

    let body: CheckoutRequestBody;
    try {
      body = await request.json();
    } catch {
      return badRequest('Request body must be valid JSON.');
    }

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return badRequest('items must be a non-empty array.');
    }
    for (const item of body.items) {
      if (
        typeof item.productId !== 'string' ||
        typeof item.size !== 'string' ||
        typeof item.colorName !== 'string' ||
        typeof item.quantity !== 'number' ||
        !Number.isInteger(item.quantity) ||
        item.quantity <= 0 ||
        item.quantity > MAX_QUANTITY_PER_LINE
      ) {
        return badRequest('Each item must have productId, size, colorName (strings) and a positive integer quantity.');
      }
    }

    // Look up every requested product's REAL price/name/stock from the database.
    // The client only ever sends ids + quantities — never a price. This is the
    // step that stops someone from editing localStorage to pay less than the
    // real price.
    const productIds = [...new Set(body.items.map((i) => i.productId))];
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, price_cents, currency, in_stock, image_url')
      .in('id', productIds);

    if (productsError) {
      console.error('checkout: failed to load products', productsError);
      return Response.json({ error: 'Failed to load product data.' }, { status: 500 });
    }

    const productById = new Map((products ?? []).map((p) => [p.id, p]));

    // Check inventory per size/color while we're here, so we don't sell what's not in stock.
    const { data: inventoryRows, error: inventoryError } = await supabase
      .from('inventory')
      .select('product_id, size, color_name, quantity')
      .in('product_id', productIds);

    if (inventoryError) {
      console.error('checkout: failed to load inventory', inventoryError);
      return Response.json({ error: 'Failed to load inventory data.' }, { status: 500 });
    }

    const inventoryKey = (productId: string, size: string, colorName: string) =>
      `${productId}__${size}__${colorName}`;
    const inventoryByKey = new Map(
      (inventoryRows ?? []).map((row) => [inventoryKey(row.product_id, row.size, row.color_name), row.quantity])
    );

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    const orderItemsToInsert: {
      product_id: string;
      product_name: string;
      size: string;
      color_name: string;
      unit_price_cents: number;
      quantity: number;
    }[] = [];
    let subtotalCents = 0;

    for (const item of body.items) {
      const product = productById.get(item.productId);
      if (!product) {
        return badRequest(`Unknown product: ${item.productId}`);
      }
      if (!product.in_stock) {
        return badRequest(`${product.name} is currently out of stock.`);
      }

      const available = inventoryByKey.get(inventoryKey(item.productId, item.size, item.colorName));
      if (available === undefined || available < item.quantity) {
        return badRequest(
          `${product.name} (${item.size}, ${item.colorName}) — only ${available ?? 0} left in stock, ${item.quantity} requested.`
        );
      }

      subtotalCents += product.price_cents * item.quantity;

      orderItemsToInsert.push({
        product_id: item.productId,
        product_name: product.name,
        size: item.size,
        color_name: item.colorName,
        unit_price_cents: product.price_cents,
        quantity: item.quantity,
      });

      lineItems.push({
        quantity: item.quantity,
        price_data: {
          currency: product.currency || 'usd',
          unit_amount: product.price_cents,
          product_data: {
            name: `${product.name} — ${item.size}, ${item.colorName}`,
            images: product.image_url ? [absoluteImageUrl(request, product.image_url)] : undefined,
            metadata: { product_id: item.productId, size: item.size, color: item.colorName },
          },
        },
      });
    }

    // Create a pending order row FIRST, so we have an id to attach to the
    // Checkout Session's metadata. The webhook flips this to 'paid' once
    // Stripe confirms payment — see api/webhook.ts.
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        status: 'pending',
        user_id: user.id,
        subtotal_cents: subtotalCents,
        total_cents: subtotalCents, // shipping/tax are added by Stripe Checkout itself; reconciled by the webhook
        currency: 'usd',
      })
      .select('id')
      .single();

    if (orderError || !order) {
      console.error('checkout: failed to create pending order', orderError);
      return Response.json({ error: 'Failed to start checkout.' }, { status: 500 });
    }

    const itemsWithOrderId = orderItemsToInsert.map((oi) => ({ ...oi, order_id: order.id }));
    const { error: orderItemsError } = await supabase.from('order_items').insert(itemsWithOrderId);
    if (orderItemsError) {
      console.error('checkout: failed to insert order_items', orderItemsError);
      // Not fatal to abort here — the order row exists but is incomplete.
      // Mark it cancelled so it doesn't linger as a confusing "pending" order.
      await supabase.from('orders').update({ status: 'cancelled' }).eq('id', order.id);
      return Response.json({ error: 'Failed to start checkout.' }, { status: 500 });
    }

    const stripe = new Stripe(secretKey, { apiVersion: STRIPE_API_VERSION });

    const origin = request.headers.get('origin') || new URL(request.url).origin;

    let session: Stripe.Checkout.Session;
    try {
      session = await stripe.checkout.sessions.create({
        // Stripe renamed this enum value from 'embedded' to 'embedded_page'
        // in a dahlia-version update (see Stripe's changelog: "Updates
        // Checkout Session UI mode enum values", 2026-03-25) — 'embedded'
        // now fails outright. embedded_page is the direct replacement for
        // the same no-redirect, on-page experience this integration uses.
        ui_mode: 'embedded_page',
        mode: 'payment',
        line_items: lineItems,
        customer_email: user.email,
        shipping_address_collection: {
          allowed_countries: ['US', 'CA', 'GB', 'AU', 'BD'], // matches the freelance/stock-photo target markets already in this project's context; adjust as needed
        },
        metadata: { order_id: order.id, user_id: user.id },
        payment_intent_data: { metadata: { order_id: order.id, user_id: user.id } },
        return_url: `${origin}/checkout/return?session_id={CHECKOUT_SESSION_ID}`,
      });
    } catch (err) {
      console.error('checkout: Stripe session creation failed', err);
      await supabase.from('orders').update({ status: 'cancelled' }).eq('id', order.id);
      return Response.json({ error: 'Failed to create payment session.' }, { status: 500 });
    }

    await supabase.from('orders').update({ stripe_checkout_session_id: session.id }).eq('id', order.id);

    return Response.json({ clientSecret: session.client_secret });
}

function absoluteImageUrl(request: Request, imagePath: string): string {
  if (imagePath.startsWith('http')) return imagePath;
  const origin = request.headers.get('origin') || new URL(request.url).origin;
  return `${origin}${imagePath}`;
}
