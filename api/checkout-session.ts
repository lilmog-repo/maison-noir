import Stripe from 'stripe';

const STRIPE_API_VERSION = '2026-06-24.dahlia' as Stripe.LatestApiVersion;

export default {
  async fetch(request: Request) {
    if (request.method !== 'GET') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }

    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      console.error('checkout-session: STRIPE_SECRET_KEY not set');
      return Response.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    const url = new URL(request.url);
    const sessionId = url.searchParams.get('session_id');
    if (!sessionId || !sessionId.startsWith('cs_')) {
      return Response.json({ error: 'Missing or invalid session_id' }, { status: 400 });
    }

    const stripe = new Stripe(secretKey, { apiVersion: STRIPE_API_VERSION });

    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      return Response.json({
        status: session.status, // 'open' | 'complete' | 'expired'
        paymentStatus: session.payment_status, // 'paid' | 'unpaid' | 'no_payment_required'
        customerEmail: session.customer_details?.email ?? null,
        orderId: session.metadata?.order_id ?? null,
      });
    } catch (err) {
      console.error('checkout-session: failed to retrieve session', err);
      return Response.json({ error: 'Session not found' }, { status: 404 });
    }
  },
};
