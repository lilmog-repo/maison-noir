-- Maison Noir — accounts, wishlist, and saved addresses
-- Depends on Supabase Auth already being enabled (it is, by default, on every project).

-- ─── profiles ───────────────────────────────────────────────────────────
-- Extends auth.users, which Supabase manages and whose non-id columns can
-- change without notice — per Supabase's own docs, only auth.users(id) is
-- safe to reference directly. Everything else about the user lives here.
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-create a profile row whenever someone signs up, whether via
-- email/password or Google OAuth. This is the standard Supabase pattern —
-- application code should never need to manually insert into profiles.
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ─── wishlist_items ─────────────────────────────────────────────────────
create table if not exists wishlist_items (
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id text not null references products(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

-- ─── addresses ──────────────────────────────────────────────────────────
create table if not exists addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  label text not null default 'Home',       -- e.g. 'Home', 'Work'
  full_name text not null,
  line1 text not null,
  line2 text,
  city text not null,
  state text,
  postal_code text not null,
  country text not null,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_addresses_user on addresses(user_id);

-- ─── orders: link to the buyer's account ───────────────────────────────
-- Nullable for now so existing test orders from before accounts existed
-- don't break; the checkout endpoint will always set this going forward
-- since accounts are required to purchase.
alter table orders add column if not exists user_id uuid references auth.users(id) on delete set null;
create index if not exists idx_orders_user on orders(user_id);

-- ─── row level security ─────────────────────────────────────────────────
alter table profiles enable row level security;
alter table wishlist_items enable row level security;
alter table addresses enable row level security;

-- Profiles: a user can read/update only their own profile. No public read —
-- unlike the products/collections catalog, there's no reason a stranger
-- should be able to look up someone else's display name via the API.
create policy "users can view own profile" on profiles
  for select using (auth.uid() = id);
create policy "users can update own profile" on profiles
  for update using (auth.uid() = id);

-- Wishlist: fully private per-user CRUD via the anon/publishable key,
-- enforced entirely by RLS — the browser can call these directly, it
-- doesn't need to go through a serverless function.
create policy "users can view own wishlist" on wishlist_items
  for select using (auth.uid() = user_id);
create policy "users can add to own wishlist" on wishlist_items
  for insert with check (auth.uid() = user_id);
create policy "users can remove from own wishlist" on wishlist_items
  for delete using (auth.uid() = user_id);

-- Addresses: same pattern — private per-user CRUD.
create policy "users can view own addresses" on addresses
  for select using (auth.uid() = user_id);
create policy "users can insert own addresses" on addresses
  for insert with check (auth.uid() = user_id);
create policy "users can update own addresses" on addresses
  for update using (auth.uid() = user_id);
create policy "users can delete own addresses" on addresses
  for delete using (auth.uid() = user_id);

-- Orders: allow a signed-in user to read their OWN order history directly
-- (for the account page), on top of the existing service-role-only access
-- used by checkout.ts/webhook.ts. Still no insert/update policy for
-- anon/authenticated — orders can only be created/modified server-side.
create policy "users can view own orders" on orders
  for select using (auth.uid() = user_id);

create policy "users can view own order items" on order_items
  for select using (
    exists (
      select 1 from orders
      where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
    )
  );
