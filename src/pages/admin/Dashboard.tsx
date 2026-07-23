import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { supabase } from '@/lib/supabase';
import { AdminNav } from '@/components/admin/AdminNav';

interface Stats {
  totalRevenueCents: number;
  orderCount: number | null;
  pendingCount: number | null;
  paidCount: number | null;
}

function fmtCount(n: number | null) {
  // Supabase returns count: null (not an error) when RLS silently blocks the
  // query — showing '—' instead of '0' here means a misconfigured policy is
  // visibly different from a genuinely empty store, rather than looking the same.
  return n === null ? '—' : String(n);
}

function fmtMoney(cents: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      // "Revenue" here means orders that have actually been paid — pending
      // orders (checkout started but not completed) shouldn't count, and
      // cancelled/refunded shouldn't either. Counting only 'paid' and
      // 'fulfilled' keeps this honest rather than inflating the number with
      // abandoned checkouts.
      const { data: paidOrders } = await supabase
        .from('orders')
        .select('total_cents, status')
        .in('status', ['paid', 'fulfilled']);

      const { count: totalOrderCount } = await supabase.from('orders').select('*', { count: 'exact', head: true });
      const { count: pendingCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');
      const { count: paidCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .in('status', ['paid', 'fulfilled']);

      const totalRevenueCents = (paidOrders ?? []).reduce((sum, o) => sum + o.total_cents, 0);

      setStats({
        totalRevenueCents,
        orderCount: totalOrderCount,
        pendingCount: pendingCount,
        paidCount: paidCount,
      });
      setIsLoading(false);
    })();
  }, []);

  return (
    <div className="min-h-[100dvh] flex flex-col pt-24 bg-background">
      <AdminNav />
      <div className="flex-1 px-6 lg:px-12 pb-16">
        <div className="container mx-auto max-w-4xl">
          <h1 className="font-serif text-3xl mb-8 mt-4">Dashboard</h1>

          {isLoading || !stats ? (
            <p className="text-sm text-muted-foreground font-light">Loading…</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              <StatCard label="Revenue (paid orders)" value={fmtMoney(stats.totalRevenueCents)} />
              <StatCard label="Total Orders" value={fmtCount(stats.orderCount)} />
              <StatCard label="Paid / Fulfilled" value={fmtCount(stats.paidCount)} />
              <StatCard label="Pending" value={fmtCount(stats.pendingCount)} />
            </div>
          )}

          <div className="flex gap-4">
            <Link
              href="/admin/orders"
              className="text-xs tracking-[0.15em] uppercase underline underline-offset-4 hover:text-accent transition-colors"
            >
              View All Orders
            </Link>
            <Link
              href="/admin/products"
              className="text-xs tracking-[0.15em] uppercase underline underline-offset-4 hover:text-accent transition-colors"
            >
              Manage Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-border p-5">
      <p className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-2">{label}</p>
      <p className="text-2xl font-serif">{value}</p>
    </div>
  );
}
