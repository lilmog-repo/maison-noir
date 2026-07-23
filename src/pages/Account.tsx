import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { RequireAuth } from '@/components/auth/RequireAuth';

interface OrderSummary {
  id: string;
  status: string;
  total_cents: number;
  currency: string;
  created_at: string;
}

interface Address {
  id: string;
  label: string;
  full_name: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string | null;
  postal_code: string;
  country: string;
  is_default: boolean;
}

type AddressForm = Omit<Address, 'id'>;

const emptyAddressForm: AddressForm = {
  label: 'Home',
  full_name: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  postal_code: '',
  country: '',
  is_default: false,
};

function fmtMoney(cents: number, currency: string) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency.toUpperCase() }).format(cents / 100);
}

function statusLabel(status: string) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export default function Account() {
  return (
    <RequireAuth>
      <AccountContent />
    </RequireAuth>
  );
}

function AccountContent() {
  const { user, signOut } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);

  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState<AddressForm>(emptyAddressForm);
  const [addressError, setAddressError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    supabase
      .from('profiles')
      .select('display_name')
      .eq('id', user.id)
      .single()
      .then(({ data }) => setDisplayName(data?.display_name ?? ''));

    supabase
      .from('orders')
      .select('id, status, total_cents, currency, created_at')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setOrders(data ?? []);
        setIsLoadingOrders(false);
      });

    loadAddresses();
  }, [user]);

  async function loadAddresses() {
    setIsLoadingAddresses(true);
    const { data } = await supabase
      .from('addresses')
      .select('*')
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false });
    setAddresses(data ?? []);
    setIsLoadingAddresses(false);
  }

  function startAddAddress() {
    setAddressForm(emptyAddressForm);
    setEditingAddressId(null);
    setIsAddingAddress(true);
    setAddressError(null);
  }

  function startEditAddress(address: Address) {
    setAddressForm({
      label: address.label,
      full_name: address.full_name,
      line1: address.line1,
      line2: address.line2 ?? '',
      city: address.city,
      state: address.state ?? '',
      postal_code: address.postal_code,
      country: address.country,
      is_default: address.is_default,
    });
    setEditingAddressId(address.id);
    setIsAddingAddress(true);
    setAddressError(null);
  }

  async function handleSaveAddress(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setAddressError(null);

    if (!addressForm.full_name.trim() || !addressForm.line1.trim() || !addressForm.city.trim() || !addressForm.postal_code.trim() || !addressForm.country.trim()) {
      setAddressError('Name, address line 1, city, postal code, and country are required.');
      return;
    }

    // Save the address itself. When un-checking "default", write that
    // directly (an address can always un-default itself safely, no race
    // condition there — only "make X the NEW default while un-defaulting
    // whatever was previously default" needs the atomic RPC below). When
    // CHECKING "default", write is_default: false here and switch to true
    // via the RPC afterward — a new address needs a real id to exist before
    // it can be the target of set_default_address in the first place.
    const { is_default: wantsDefault, ...addressCore } = addressForm;
    const addressToWrite = wantsDefault ? { ...addressCore, is_default: false } : addressForm;

    let savedAddressId: string;

    if (editingAddressId) {
      const { error } = await supabase.from('addresses').update(addressToWrite).eq('id', editingAddressId);
      if (error) {
        setAddressError('Failed to save changes.');
        return;
      }
      savedAddressId = editingAddressId;
    } else {
      const { data, error } = await supabase
        .from('addresses')
        .insert({ ...addressToWrite, user_id: user.id })
        .select('id')
        .single();
      if (error || !data) {
        setAddressError('Failed to save address.');
        return;
      }
      savedAddressId = data.id;
    }

    if (wantsDefault) {
      const { error: rpcError } = await supabase.rpc('set_default_address', { p_address_id: savedAddressId });
      if (rpcError) {
        console.error(rpcError);
        setAddressError('Address saved, but setting it as default failed. Try again from the address list.');
        return;
      }
    }

    setIsAddingAddress(false);
    loadAddresses();
  }

  async function handleDeleteAddress(id: string) {
    if (!confirm('Delete this address?')) return;
    await supabase.from('addresses').delete().eq('id', id);
    loadAddresses();
  }

  return (
    <div className="min-h-[100dvh] flex flex-col pt-24 bg-background">
      <Navbar />
      <div className="flex-1 px-6 lg:px-12 pb-16">
        <div className="container mx-auto max-w-3xl">
          <div className="flex items-center justify-between mb-10 mt-4">
            <div>
              <h1 className="font-serif text-3xl mb-1">{displayName || 'My Account'}</h1>
              <p className="text-sm text-muted-foreground font-light">{user?.email}</p>
            </div>
            <button
              onClick={signOut}
              className="text-xs tracking-[0.15em] uppercase text-muted-foreground hover:text-primary transition-colors"
            >
              Sign Out
            </button>
          </div>

          {/* ─── Order History ─────────────────────────────────────────── */}
          <section className="mb-12">
            <h2 className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-4">Order History</h2>
            {isLoadingOrders ? (
              <p className="text-sm text-muted-foreground font-light">Loading…</p>
            ) : orders.length === 0 ? (
              <p className="text-sm text-muted-foreground font-light">
                No orders yet.{' '}
                <Link href="/shop" className="underline underline-offset-4 hover:text-accent transition-colors">
                  Start shopping
                </Link>
              </p>
            ) : (
              <div className="border border-border">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between px-4 py-3 border-b border-border last:border-0 text-sm font-light"
                  >
                    <div>
                      <p>Order {order.id.slice(0, 8)}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p>{fmtMoney(order.total_cents, order.currency)}</p>
                      <p className="text-xs text-muted-foreground">{statusLabel(order.status)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ─── Saved Addresses ────────────────────────────────────────── */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground">Saved Addresses</h2>
              {!isAddingAddress && (
                <button
                  onClick={startAddAddress}
                  className="text-xs tracking-[0.15em] uppercase underline underline-offset-4 hover:text-accent transition-colors"
                >
                  + Add Address
                </button>
              )}
            </div>

            {isAddingAddress && (
              <form onSubmit={handleSaveAddress} className="border border-border p-5 mb-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Label (Home, Work…)"
                    value={addressForm.label}
                    onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                    className="border border-border px-3 py-2 text-sm font-light focus:outline-none focus:border-primary"
                  />
                  <input
                    type="text"
                    placeholder="Full name"
                    required
                    value={addressForm.full_name}
                    onChange={(e) => setAddressForm({ ...addressForm, full_name: e.target.value })}
                    className="border border-border px-3 py-2 text-sm font-light focus:outline-none focus:border-primary"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Address line 1"
                  required
                  value={addressForm.line1}
                  onChange={(e) => setAddressForm({ ...addressForm, line1: e.target.value })}
                  className="w-full border border-border px-3 py-2 text-sm font-light focus:outline-none focus:border-primary"
                />
                <input
                  type="text"
                  placeholder="Address line 2 (optional)"
                  value={addressForm.line2 ?? ''}
                  onChange={(e) => setAddressForm({ ...addressForm, line2: e.target.value })}
                  className="w-full border border-border px-3 py-2 text-sm font-light focus:outline-none focus:border-primary"
                />
                <div className="grid grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="City"
                    required
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    className="border border-border px-3 py-2 text-sm font-light focus:outline-none focus:border-primary"
                  />
                  <input
                    type="text"
                    placeholder="State / Province"
                    value={addressForm.state ?? ''}
                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                    className="border border-border px-3 py-2 text-sm font-light focus:outline-none focus:border-primary"
                  />
                  <input
                    type="text"
                    placeholder="Postal code"
                    required
                    value={addressForm.postal_code}
                    onChange={(e) => setAddressForm({ ...addressForm, postal_code: e.target.value })}
                    className="border border-border px-3 py-2 text-sm font-light focus:outline-none focus:border-primary"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Country"
                  required
                  value={addressForm.country}
                  onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                  className="w-full border border-border px-3 py-2 text-sm font-light focus:outline-none focus:border-primary"
                />
                <label className="flex items-center gap-2 text-sm font-light cursor-pointer">
                  <input
                    type="checkbox"
                    checked={addressForm.is_default}
                    onChange={(e) => setAddressForm({ ...addressForm, is_default: e.target.checked })}
                  />
                  Set as default
                </label>

                {addressError && <p className="text-sm text-red-600 font-light">{addressError}</p>}

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="py-2.5 px-5 bg-primary text-white text-xs tracking-[0.15em] uppercase hover:bg-primary/90 transition-colors"
                  >
                    Save Address
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingAddress(false)}
                    className="py-2.5 px-5 border border-border text-xs tracking-[0.15em] uppercase hover:bg-black/[0.02] transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {isLoadingAddresses ? (
              <p className="text-sm text-muted-foreground font-light">Loading…</p>
            ) : addresses.length === 0 && !isAddingAddress ? (
              <p className="text-sm text-muted-foreground font-light">No saved addresses yet.</p>
            ) : (
              <div className="border border-border">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className="flex items-start justify-between px-4 py-3 border-b border-border last:border-0 text-sm font-light"
                  >
                    <div>
                      <p className="flex items-center gap-2">
                        {address.label}
                        {address.is_default && (
                          <span className="text-[9px] tracking-[0.1em] uppercase text-muted-foreground border border-border px-1.5 py-0.5">
                            Default
                          </span>
                        )}
                      </p>
                      <p className="text-muted-foreground text-xs mt-1">
                        {address.full_name}
                        <br />
                        {address.line1}
                        {address.line2 && <>, {address.line2}</>}
                        <br />
                        {address.city}, {address.state} {address.postal_code}
                        <br />
                        {address.country}
                      </p>
                    </div>
                    <div className="flex gap-3 shrink-0">
                      <button
                        onClick={() => startEditAddress(address)}
                        className="text-xs underline underline-offset-4 hover:text-accent transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteAddress(address.id)}
                        className="text-xs text-red-600 underline underline-offset-4 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
