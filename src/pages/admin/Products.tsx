import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { supabase } from '@/lib/supabase';
import { AdminNav } from '@/components/admin/AdminNav';

interface ProductRow {
  id: string;
  name: string;
  category: string;
  price_cents: number;
  in_stock: boolean;
  image_url: string;
}

function fmtMoney(cents: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
}

export default function AdminProducts() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from('products')
      .select('id, name, category, price_cents, in_stock, image_url')
      .order('name')
      .then(({ data }) => {
        setProducts(data ?? []);
        setIsLoading(false);
      });
  }, []);

  async function toggleStock(productId: string, currentValue: boolean) {
    setUpdatingId(productId);
    const { error } = await supabase.from('products').update({ in_stock: !currentValue }).eq('id', productId);
    if (!error) {
      setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, in_stock: !currentValue } : p)));
    }
    setUpdatingId(null);
  }

  return (
    <div className="min-h-[100dvh] flex flex-col pt-24 bg-background">
      <AdminNav />
      <div className="flex-1 px-6 lg:px-12 pb-16">
        <div className="container mx-auto max-w-5xl">
          <div className="flex items-center justify-between mb-8 mt-4">
            <h1 className="font-serif text-3xl">Products</h1>
            <Link
              href="/admin/products/new"
              className="text-xs tracking-[0.15em] uppercase bg-primary text-white px-4 py-2 hover:bg-primary/90 transition-colors"
            >
              + New Product
            </Link>
          </div>

          {isLoading ? (
            <p className="text-sm text-muted-foreground font-light">Loading…</p>
          ) : (
            <div className="border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-[10px] tracking-[0.15em] uppercase text-muted-foreground">
                    <th className="px-4 py-3 font-normal">Product</th>
                    <th className="px-4 py-3 font-normal">Category</th>
                    <th className="px-4 py-3 font-normal">Price</th>
                    <th className="px-4 py-3 font-normal">In Stock</th>
                    <th className="px-4 py-3 font-normal"></th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-border last:border-0">
                      <td className="px-4 py-3 font-light flex items-center gap-3">
                        <img src={product.image_url} alt="" className="w-10 h-10 object-cover" />
                        {product.name}
                      </td>
                      <td className="px-4 py-3 font-light text-muted-foreground">{product.category}</td>
                      <td className="px-4 py-3 font-light">{fmtMoney(product.price_cents)}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleStock(product.id, product.in_stock)}
                          disabled={updatingId === product.id}
                          className={
                            product.in_stock
                              ? 'text-xs px-2 py-1 bg-green-50 text-green-700 border border-green-200 disabled:opacity-50'
                              : 'text-xs px-2 py-1 bg-red-50 text-red-700 border border-red-200 disabled:opacity-50'
                          }
                        >
                          {product.in_stock ? 'In Stock' : 'Out of Stock'}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="text-xs underline underline-offset-4 hover:text-accent transition-colors"
                        >
                          Edit
                        </Link>
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
