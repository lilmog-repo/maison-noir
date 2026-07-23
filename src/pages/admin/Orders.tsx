import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { supabase } from '@/lib/supabase';
import { AdminNav } from '@/components/admin/AdminNav';

interface OrderRow {
  id: string;
  status: string;
  customer_email: string | null;
  customer_name: string | null;
  total_cents: number;
  currency: string;
  created_at: string;
}

const STATUS_OPTIONS = ['pending', 'paid', 'fulfilled', 'cancelled', 'refunded'] as const;

function fmtMoney(cents: number, currency: string) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency.toUpperCase() }).format(cents / 100);
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  async function loadOrders() {
    setIsLoading(true);
    let query = supabase
      .from('orders')
      .select('id, status, customer_email, customer_name, total_cents, currency, created_at')
      .order('created_at', { ascending: false })
      .limit(200);

    if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    const { data } = await query;
    setOrders(data ?? []);
    setIsLoading(false);
  }

  async function updateStatus(orderId: string, newStatus: string) {
    setUpdatingId(orderId);
    // Enforced server-side too: the "admins can update orders" RLS policy
    // (0005_admin_role.sql) is what actually allows this write — this call
    // would be silently rejected by RLS if isAdmin were somehow wrong.
    const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
    if (!error) {
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
    }
    setUpdatingId(null);
  }

  return (
    <div className="min-h-[100dvh] flex flex-col pt-24 bg-background">
      <AdminNav />
      <div className="flex-1 px-6 lg:px-12 pb-16">
        <div className="container mx-auto max-w-5xl">
          <div className="flex items-center justify-between mb-8 mt-4">
            <h1 className="font-serif text-3xl">Orders</h1>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-border px-3 py-2 text-sm font-light bg-white"
            >
              <option value="all">All statuses</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {isLoading ? (
            <p className="text-sm text-muted-foreground font-light">Loading…</p>
          ) : orders.length === 0 ? (
            <p className="text-sm text-muted-foreground font-light">No orders yet.</p>
          ) : (
            <div className="border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-[10px] tracking-[0.15em] uppercase text-muted-foreground">
                    <th className="px-4 py-3 font-normal">Order</th>
                    <th className="px-4 py-3 font-normal">Customer</th>
                    <th className="px-4 py-3 font-normal">Total</th>
                    <th className="px-4 py-3 font-normal">Date</th>
                    <th className="px-4 py-3 font-normal">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-border last:border-0">
                      <td className="px-4 py-3 font-light">
                        <Link href={`/admin/orders/${order.id}`} className="underline underline-offset-4 hover:text-accent">
                          {order.id.slice(0, 8)}
                        </Link>
                      </td>
                      <td className="px-4 py-3 font-light">
                        {order.customer_name || order.customer_email || '—'}
                      </td>
                      <td className="px-4 py-3 font-light">{fmtMoney(order.total_cents, order.currency)}</td>
                      <td className="px-4 py-3 font-light text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={order.status}
                          disabled={updatingId === order.id}
                          onChange={(e) => updateStatus(order.id, e.target.value)}
                          className="border border-border px-2 py-1 text-xs font-light bg-white disabled:opacity-50"
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
