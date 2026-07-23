import { useCallback, useMemo, useState } from 'react';
import { Link } from 'wouter';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

// loadStripe is called once at module scope — calling it inside the component
// would recreate the Stripe object on every render, which Stripe's own docs
// explicitly warn against.
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;

export default function Checkout() {
  const { items } = useCart();
  const { session } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const isEmpty = items.length === 0;

  // The request body only ever contains ids, sizes, colors, and quantities —
  // never a price. The server looks up the real price itself. See api/checkout.ts.
  const requestItems = useMemo(
    () =>
      items.map((i) => ({
        productId: i.product.id,
        size: i.size,
        colorName: i.color.name,
        quantity: i.quantity,
      })),
    [items]
  );

  const fetchClientSecret = useCallback(async () => {
    setError(null);

    if (!session) {
      setError('You need to be signed in to check out.');
      throw new Error('no active session');
    }

    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ items: requestItems }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({ error: 'Something went wrong starting checkout.' }));
      setError(body.error || 'Something went wrong starting checkout.');
      throw new Error(body.error || 'checkout request failed');
    }

    const { clientSecret } = await res.json();
    return clientSecret as string;
  }, [requestItems, session]);

  if (!stripePublishableKey) {
    return (
      <div className="min-h-[100dvh] flex flex-col pt-24 bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-6 text-center">
          <p className="text-sm text-muted-foreground font-light max-w-sm">
            Checkout isn't configured yet. Set VITE_STRIPE_PUBLISHABLE_KEY in the environment.
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="min-h-[100dvh] flex flex-col pt-24 bg-background">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-6">
          <p className="text-sm text-muted-foreground font-light">Your bag is empty.</p>
          <Link
            href="/shop"
            className="text-xs tracking-[0.15em] uppercase underline underline-offset-4 hover:text-accent transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] flex flex-col pt-24 bg-background">
      <Navbar />
      <div className="flex-1 px-6 lg:px-12 pb-16">
        <div className="container mx-auto max-w-3xl">
          <h1 className="font-serif text-3xl lg:text-4xl mb-8 mt-4">Checkout</h1>
          {error && (
            <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}
          <div id="checkout" className="bg-white">
            <EmbeddedCheckoutProvider stripe={stripePromise} options={{ fetchClientSecret }}>
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
