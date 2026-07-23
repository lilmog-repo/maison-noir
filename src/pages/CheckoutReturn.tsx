import { useEffect, useState } from 'react';
import { Link, useSearch } from 'wouter';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useCart } from '@/context/CartContext';

type Status = 'loading' | 'complete' | 'open' | 'expired' | 'error';

export default function CheckoutReturn() {
  const search = useSearch();
  const { clearCart } = useCart();
  const [status, setStatus] = useState<Status>('loading');
  const [orderId, setOrderId] = useState<string | null>(null);
  const [customerEmail, setCustomerEmail] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(search);
    const sessionId = params.get('session_id');
    if (!sessionId) {
      setStatus('error');
      return;
    }

    let cancelled = false;

    fetch(`/api/checkout-session?session_id=${encodeURIComponent(sessionId)}`)
      .then((res) => {
        if (!res.ok) throw new Error('failed to verify session');
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        // We trust the SERVER's verdict on payment status here, retrieved
        // fresh from Stripe — not anything encoded in the URL itself, which
        // could in principle be shared/reused/tampered with.
        if (data.status === 'complete') {
          setStatus('complete');
          setOrderId(data.orderId);
          setCustomerEmail(data.customerEmail);
          clearCart();
        } else if (data.status === 'expired') {
          setStatus('expired');
        } else {
          setStatus('open');
        }
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <div className="min-h-[100dvh] flex flex-col pt-24 bg-background">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="max-w-md w-full text-center">
          {status === 'loading' && (
            <>
              <Loader2 className="w-8 h-8 mx-auto mb-6 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground font-light">Confirming your order…</p>
            </>
          )}

          {status === 'complete' && (
            <>
              <CheckCircle2 className="w-10 h-10 mx-auto mb-6 text-primary" strokeWidth={1.5} />
              <h1 className="font-serif text-2xl lg:text-3xl mb-3">Thank you</h1>
              <p className="text-sm text-muted-foreground font-light mb-1">
                Your order has been confirmed.
              </p>
              {customerEmail && (
                <p className="text-sm text-muted-foreground font-light mb-8">
                  A confirmation has been sent to {customerEmail}.
                </p>
              )}
              {orderId && (
                <p className="text-xs text-muted-foreground/70 font-light mb-8 tracking-wide">
                  Order reference: {orderId}
                </p>
              )}
              <Link
                href="/shop"
                className="inline-block text-xs tracking-[0.15em] uppercase underline underline-offset-4 hover:text-accent transition-colors"
              >
                Continue Shopping
              </Link>
            </>
          )}

          {(status === 'open' || status === 'expired') && (
            <>
              <XCircle className="w-10 h-10 mx-auto mb-6 text-muted-foreground" strokeWidth={1.5} />
              <h1 className="font-serif text-2xl mb-3">
                {status === 'expired' ? 'This checkout session has expired' : 'Payment not completed'}
              </h1>
              <p className="text-sm text-muted-foreground font-light mb-8">
                Your card has not been charged. You can try again from your bag.
              </p>
              <Link
                href="/shop"
                className="inline-block text-xs tracking-[0.15em] uppercase underline underline-offset-4 hover:text-accent transition-colors"
              >
                Return to Shop
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle className="w-10 h-10 mx-auto mb-6 text-muted-foreground" strokeWidth={1.5} />
              <h1 className="font-serif text-2xl mb-3">Something went wrong</h1>
              <p className="text-sm text-muted-foreground font-light mb-8">
                We couldn't confirm your order status. If you were charged, please contact us with your
                confirmation email.
              </p>
              <Link
                href="/"
                className="inline-block text-xs tracking-[0.15em] uppercase underline underline-offset-4 hover:text-accent transition-colors"
              >
                Return Home
              </Link>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
