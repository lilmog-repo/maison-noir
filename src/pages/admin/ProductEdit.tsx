import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'wouter';
import { supabase } from '@/lib/supabase';
import { AdminNav } from '@/components/admin/AdminNav';

const CATEGORIES = ['Outerwear', 'Tops', 'Bottoms', 'Dresses', 'Accessories', 'Knitwear'];

interface ProductColorForm {
  name: string;
  hex: string;
}

interface ProductForm {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: string; // dollars, as a string for the input; converted to cents on save
  description: string;
  imageUrl: string;
  inStock: boolean;
  sizes: string[];
  colors: ProductColorForm[];
}

const emptyForm: ProductForm = {
  id: '',
  slug: '',
  name: '',
  category: CATEGORIES[0],
  price: '',
  description: '',
  imageUrl: '',
  inStock: true,
  sizes: [],
  colors: [],
};

// quantity keyed by `${size}__${colorName}`, matching the DB's composite
// uniqueness on (product_id, size, color_name)
type InventoryMap = Record<string, number>;

function inventoryKey(size: string, colorName: string) {
  return `${size}__${colorName}`;
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function AdminProductEdit() {
  const params = useParams<{ id?: string }>();
  const [, navigate] = useLocation();
  const isNew = !params.id || params.id === 'new';

  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [inventory, setInventory] = useState<InventoryMap>({});
  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingVariants, setIsSavingVariants] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [variantsMessage, setVariantsMessage] = useState<string | null>(null);
  const [newSize, setNewSize] = useState('');
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#000000');

  useEffect(() => {
    if (isNew) return;
    (async () => {
      const [{ data: product }, { data: inventoryRows }] = await Promise.all([
        supabase
          .from('products')
          .select('id, slug, name, category, price_cents, description, image_url, in_stock, sizes, colors')
          .eq('id', params.id)
          .single(),
        supabase.from('inventory').select('size, color_name, quantity').eq('product_id', params.id),
      ]);

      if (product) {
        setForm({
          id: product.id,
          slug: product.slug,
          name: product.name,
          category: product.category,
          price: (product.price_cents / 100).toFixed(2),
          description: product.description,
          imageUrl: product.image_url,
          inStock: product.in_stock,
          sizes: product.sizes ?? [],
          colors: (product.colors ?? []) as ProductColorForm[],
        });
      }

      const invMap: InventoryMap = {};
      for (const row of inventoryRows ?? []) {
        invMap[inventoryKey(row.size, row.color_name)] = row.quantity;
      }
      setInventory(invMap);

      setIsLoading(false);
    })();
  }, [isNew, params.id]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const priceCents = Math.round(parseFloat(form.price) * 100);
    if (!form.name.trim() || isNaN(priceCents) || priceCents < 0) {
      setError('Name and a valid price are required.');
      return;
    }

    setIsSaving(true);

    if (isNew) {
      const id = `p-${Date.now().toString(36)}`; // simple unique id; fine at this store's scale
      const slug = slugify(form.name);
      const { error: insertError } = await supabase.from('products').insert({
        id,
        slug,
        name: form.name,
        category: form.category,
        price_cents: priceCents,
        description: form.description,
        image_url: form.imageUrl,
        images: form.imageUrl ? [form.imageUrl] : [],
        in_stock: form.inStock,
        sizes: form.sizes,
        colors: form.colors,
      });
      setIsSaving(false);
      if (insertError) {
        console.error(insertError);
        setError('Failed to create product.');
        return;
      }
      // Redirect to the edit URL for the now-real id, rather than back to
      // the list — sizes/colors are saved, but per-variant inventory can
      // only be set once the product row (and its id) genuinely exists,
      // so land the admin right where they can do that next.
      navigate(`/admin/products/${id}`);
    } else {
      const { error: updateError } = await supabase
        .from('products')
        .update({
          name: form.name,
          category: form.category,
          price_cents: priceCents,
          description: form.description,
          image_url: form.imageUrl,
          in_stock: form.inStock,
          sizes: form.sizes,
          colors: form.colors,
          updated_at: new Date().toISOString(),
        })
        .eq('id', form.id);
      setIsSaving(false);
      if (updateError) {
        console.error(updateError);
        setError('Failed to save changes.');
        return;
      }
      navigate('/admin/products');
    }
  }

  function addSize() {
    const trimmed = newSize.trim().toUpperCase();
    if (!trimmed || form.sizes.includes(trimmed)) return;
    setForm({ ...form, sizes: [...form.sizes, trimmed] });
    setNewSize('');
  }

  function removeSize(size: string) {
    setForm({ ...form, sizes: form.sizes.filter((s) => s !== size) });
  }

  function addColor() {
    const trimmed = newColorName.trim();
    if (!trimmed || form.colors.some((c) => c.name === trimmed)) return;
    setForm({ ...form, colors: [...form.colors, { name: trimmed, hex: newColorHex }] });
    setNewColorName('');
    setNewColorHex('#000000');
  }

  function removeColor(name: string) {
    setForm({ ...form, colors: form.colors.filter((c) => c.name !== name) });
  }

  async function saveInventory() {
    if (!form.id) return; // shouldn't happen — variants section is disabled until form.id exists
    setIsSavingVariants(true);
    setVariantsMessage(null);

    const rows = form.sizes.flatMap((size) =>
      form.colors.map((color) => ({
        product_id: form.id,
        size,
        color_name: color.name,
        quantity: inventory[inventoryKey(size, color.name)] ?? 0,
      }))
    );

    if (rows.length === 0) {
      setIsSavingVariants(false);
      setVariantsMessage('Add at least one size and one color first.');
      return;
    }

    // Upsert on the same (product_id, size, color_name) uniqueness the DB
    // already enforces (0001_init.sql) — this naturally handles both "new
    // combination" and "update existing quantity" in one call.
    const { error: upsertError } = await supabase
      .from('inventory')
      .upsert(rows, { onConflict: 'product_id,size,color_name' });

    setIsSavingVariants(false);
    if (upsertError) {
      console.error(upsertError);
      setVariantsMessage('Failed to save inventory.');
      return;
    }
    setVariantsMessage('Inventory saved.');
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

  return (
    <div className="min-h-[100dvh] flex flex-col pt-24 bg-background">
      <AdminNav />
      <div className="flex-1 px-6 lg:px-12 pb-16">
        <div className="container mx-auto max-w-2xl">
          <h1 className="font-serif text-3xl mb-8 mt-4">{isNew ? 'New Product' : 'Edit Product'}</h1>

          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="block text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-2">
                Name
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-border px-4 py-3 text-sm font-light focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-2">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full border border-border px-4 py-3 text-sm font-light bg-white"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-2">
                  Price (USD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full border border-border px-4 py-3 text-sm font-light focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-2">
                Image URL
              </label>
              <input
                type="text"
                placeholder="/product-13.jpg"
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                className="w-full border border-border px-4 py-3 text-sm font-light focus:outline-none focus:border-primary transition-colors"
              />
              <p className="text-xs text-muted-foreground/70 font-light mt-1.5">
                Path to an image already in /public, or a full URL.
              </p>
            </div>

            <div>
              <label className="block text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-2">
                Description
              </label>
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full border border-border px-4 py-3 text-sm font-light focus:outline-none focus:border-primary transition-colors resize-none"
              />
            </div>

            <label className="flex items-center gap-2 text-sm font-light cursor-pointer">
              <input
                type="checkbox"
                checked={form.inStock}
                onChange={(e) => setForm({ ...form, inStock: e.target.checked })}
              />
              In stock
            </label>

            <div>
              <label className="block text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-2">
                Sizes
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {form.sizes.map((size) => (
                  <span
                    key={size}
                    className="inline-flex items-center gap-1.5 text-xs border border-border px-2 py-1"
                  >
                    {size}
                    <button
                      type="button"
                      onClick={() => removeSize(size)}
                      className="text-muted-foreground hover:text-red-600"
                      aria-label={`Remove ${size}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. M"
                  value={newSize}
                  onChange={(e) => setNewSize(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSize();
                    }
                  }}
                  className="border border-border px-3 py-2 text-sm font-light w-32 focus:outline-none focus:border-primary"
                />
                <button
                  type="button"
                  onClick={addSize}
                  className="text-xs tracking-[0.1em] uppercase border border-border px-3 hover:bg-black/[0.02] transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-2">
                Colors
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {form.colors.map((color) => (
                  <span
                    key={color.name}
                    className="inline-flex items-center gap-1.5 text-xs border border-border px-2 py-1"
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-border/50"
                      style={{ backgroundColor: color.hex }}
                    />
                    {color.name}
                    <button
                      type="button"
                      onClick={() => removeColor(color.name)}
                      className="text-muted-foreground hover:text-red-600"
                      aria-label={`Remove ${color.name}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Black"
                  value={newColorName}
                  onChange={(e) => setNewColorName(e.target.value)}
                  className="border border-border px-3 py-2 text-sm font-light w-32 focus:outline-none focus:border-primary"
                />
                <input
                  type="color"
                  value={newColorHex}
                  onChange={(e) => setNewColorHex(e.target.value)}
                  className="border border-border w-12 h-10 cursor-pointer"
                />
                <button
                  type="button"
                  onClick={addColor}
                  className="text-xs tracking-[0.1em] uppercase border border-border px-3 hover:bg-black/[0.02] transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

            {error && <p className="text-sm text-red-600 font-light">{error}</p>}

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="py-3 px-6 bg-primary text-white text-xs tracking-[0.15em] uppercase hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {isSaving ? 'Saving…' : isNew ? 'Create Product' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/products')}
                className="py-3 px-6 border border-border text-xs tracking-[0.15em] uppercase hover:bg-black/[0.02] transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>

          {form.id && form.sizes.length > 0 && form.colors.length > 0 && (
            <div className="mt-12 pt-8 border-t border-border">
              <h2 className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-4">
                Inventory
              </h2>
              <div className="border border-border overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-[10px] tracking-[0.15em] uppercase text-muted-foreground">
                      <th className="px-3 py-2 font-normal">Size \ Color</th>
                      {form.colors.map((color) => (
                        <th key={color.name} className="px-3 py-2 font-normal whitespace-nowrap">
                          {color.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {form.sizes.map((size) => (
                      <tr key={size} className="border-b border-border last:border-0">
                        <td className="px-3 py-2 font-light">{size}</td>
                        {form.colors.map((color) => {
                          const key = inventoryKey(size, color.name);
                          return (
                            <td key={color.name} className="px-3 py-2">
                              <input
                                type="number"
                                min="0"
                                value={inventory[key] ?? 0}
                                onChange={(e) =>
                                  setInventory({ ...inventory, [key]: Math.max(0, parseInt(e.target.value) || 0) })
                                }
                                className="w-16 border border-border px-2 py-1 text-sm font-light focus:outline-none focus:border-primary"
                              />
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center gap-4 mt-3">
                <button
                  type="button"
                  onClick={saveInventory}
                  disabled={isSavingVariants}
                  className="py-2.5 px-5 bg-primary text-white text-xs tracking-[0.15em] uppercase hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isSavingVariants ? 'Saving…' : 'Save Inventory'}
                </button>
                {variantsMessage && <p className="text-sm font-light text-muted-foreground">{variantsMessage}</p>}
              </div>
            </div>
          )}

          {form.id && (form.sizes.length === 0 || form.colors.length === 0) && (
            <p className="mt-12 pt-8 border-t border-border text-sm text-muted-foreground font-light">
              Add at least one size and one color above, then save, to manage inventory.
            </p>
          )}

          {!form.id && (
            <p className="mt-12 pt-8 border-t border-border text-sm text-muted-foreground font-light">
              Save this product first to manage sizes, colors, and inventory.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
