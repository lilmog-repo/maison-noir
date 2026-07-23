import { useEffect, useState } from 'react';
import { useParams, Link } from 'wouter';
import { supabase } from '@/lib/supabase';
import { AdminNav } from '@/components/admin/AdminNav';

interface OrderItemRow {
  id: string;
  product_name: string;
  size: string;
  color_name: string;
  unit_price_cents: number;
  quantity: number;
}

interface OrderDetail {
  id: string;
  status: string;
  customer_email: string | null;
  customer_name: string | null;
  shipping_address: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
  } | null;
  subtotal_cents: number;
  total_cents: number;
  currency: string;
  created_at: string;
  stripe_payment_intent_id: string | null;
}

const STATUS_OPTIONS = ['pending', 'paid', 'fulfilled', 'cancelled', 'refunded'] as const;

function fmtMoney(cents: number, currency: string) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency.toUpperCase() }).format(cents / 100);
}

export default function AdminOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [items, setItems] = useState<OrderItemRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      setIsLoading(true);
      const [{ data: orderData }, { data: itemsData }] = await Promise.all([
        supabase.from('orders').select('*').eq('id', id).single(),
        supabase.from('order_items').select('*').eq('order_id', id),
      ]);
      setOrder(orderData ?? null);
      setItems(itemsData ?? []);
      setIsLoading(false);
    })();
  }, [id]);

  async function updateStatus(newStatus: string) {
    if (!order) return;
    setIsUpdating(true);
    const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', order.id);
    if (!error) setOrder({ ...order, status: newStatus });
    setIsUpdating(false);
  }

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] flex flex-col pt-24 bg-background">
        <AdminNav />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[100dvh] flex flex-col pt-24 bg-background">
        <AdminNav />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-muted-foreground font-light">Order not found.</p>
        </div>
      </div>
    );
  }

  const address = order.shipping_address;

  return (
    <div className="min-h-[100dvh] flex flex-col pt-24 bg-background">
      <AdminNav />
      <div className="flex-1 px-6 lg:px-12 pb-16">
        <div className="container mx-auto max-w-3xl">
          <Link href="/admin/orders" className="text-xs text-muted-foreground hover:text-primary transition-colors mb-6 inline-block">
            ← All Orders
          </Link>

          <div className="flex items-center justify-between mb-8">
            <h1 className="font-serif text-2xl">Order {order.id.slice(0, 8)}</h1>
            <select
              value={order.status}
              disabled={isUpdating}
              onChange={(e) => updateStatus(e.target.value)}
              className="border border-border px-3 py-2 text-sm font-light bg-white disabled:opacity-50"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-10">
            <div>
              <h2 className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-3">Customer</h2>
              <p className="text-sm font-light">{order.customer_name || '—'}</p>
              <p className="text-sm font-light text-muted-foreground">{order.customer_email || '—'}</p>
              <p className="text-sm font-light text-muted-foreground mt-2">
                {new Date(order.created_at).toLocaleString()}
              </p>
            </div>
            <div>
              <h2 className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-3">
                Shipping Address
              </h2>
              {address ? (
                <address className="text-sm font-light not-italic leading-relaxed">
                  {address.line1}
                  {address.line2 && <>, {address.line2}</>}
                  <br />
                  {address.city}, {address.state} {address.postal_code}
                  <br />
                  {address.country}
                </address>
              ) : (
                <p className="text-sm font-light text-muted-foreground">Not yet available</p>
              )}
            </div>
          </div>

          <h2 className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-3">Items</h2>
          <div className="border border-border mb-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between px-4 py-3 border-b border-border last:border-0 text-sm font-light"
              >
                <div>
                  <p>{item.product_name}</p>
                  <p className="text-muted-foreground text-xs">
                    {item.size}, {item.color_name} × {item.quantity}
                  </p>
                </div>
                <p>{fmtMoney(item.unit_price_cents * item.quantity, order.currency)}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <div className="text-sm font-light space-y-1 text-right">
              <p className="text-muted-foreground">Subtotal: {fmtMoney(order.subtotal_cents, order.currency)}</p>
              <p className="font-medium">Total: {fmtMoney(order.total_cents, order.currency)}</p>
            </div>
          </div>

          {order.stripe_payment_intent_id && (
            <p className="text-xs text-muted-foreground/70 font-light mt-6">
              Stripe Payment Intent: {order.stripe_payment_intent_id}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
