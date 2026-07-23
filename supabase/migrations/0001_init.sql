-- Maison Noir — initial schema
-- Run this in Supabase SQL Editor, or via `supabase db push` once the CLI is linked.

-- ─── collections ────────────────────────────────────────────────────────
create table if not exists collections (
  id text primary key,               -- matches the app's existing string ids (e.g. 'c1')
  slug text unique not null,
  name text not null,
  description text not null default '',
  image_url text not null default '',
  season text not null default '',
  created_at timestamptz not null default now()
);

-- ─── products ───────────────────────────────────────────────────────────
-- price_cents is the source of truth for checkout. Never trust a price sent from the browser.
create table if not exists products (
  id text primary key,               -- matches the app's existing string ids (e.g. 'p1')
  slug text unique not null,
  name text not null,
  category text not null check (category in ('Outerwear','Tops','Bottoms','Dresses','Accessories','Knitwear')),
  collection_id text references collections(id) on delete set null,
  price_cents integer not null check (price_cents >= 0),
  original_price_cents integer check (original_price_cents >= 0),
  currency text not null default 'usd',
  images text[] not null default '{}',
  image_url text not null default '',
  description text not null default '',
  details text[] not null default '{}',
  sizes text[] not null default '{}',
  colors jsonb not null default '[]',   -- [{ "name": "Black", "hex": "#111111" }, ...]
  is_new boolean not null default false,
  is_bestseller boolean not null default false,
  rating numeric(2,1) not null default 0,
  review_count integer not null default 0,
  in_stock boolean not null default true,
  stripe_product_id text,            -- set once synced to Stripe
  stripe_price_id text,              -- set once synced to Stripe
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_products_collection on products(collection_id);
create index if not exists idx_products_category on products(category);

-- ─── inventory ──────────────────────────────────────────────────────────
-- Separate from products so stock can be tracked per size/color without altering the product row.
create table if not exists inventory (
  id uuid primary key default gen_random_uuid(),
  product_id text not null references products(id) on delete cascade,
  size text not null,
  color_name text not null,
  quantity integer not null default 0 check (quantity >= 0),
  updated_at timestamptz not null default now(),
  unique (product_id, size, color_name)
);

-- ─── orders ─────────────────────────────────────────────────────────────
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  stripe_checkout_session_id text unique,
  stripe_payment_intent_id text,
  status text not null default 'pending'
    check (status in ('pending','paid','fulfilled','cancelled','refunded')),
  customer_email text,
  customer_name text,
  shipping_address jsonb,            -- { line1, line2, city, state, postal_code, country }
  subtotal_cents integer not null default 0,
  shipping_cents integer not null default 0,
  tax_cents integer not null default 0,
  total_cents integer not null default 0,
  currency text not null default 'usd',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_orders_session on orders(stripe_checkout_session_id);
create index if not exists idx_orders_email on orders(customer_email);

-- ─── order_items ────────────────────────────────────────────────────────
-- Snapshots product name/price/size/color at time of purchase, independent of later product edits.
create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id text references products(id) on delete set null,
  product_name text not null,
  size text not null,
  color_name text not null,
  unit_price_cents integer not null,
  quantity integer not null check (quantity > 0),
  created_at timestamptz not null default now()
);

create index if not exists idx_order_items_order on order_items(order_id);

-- ─── webhook_events ─────────────────────────────────────────────────────
-- Stripe can send the same webhook event more than once. Recording the event id first,
-- and checking for it before processing, makes the webhook handler idempotent.
create table if not exists webhook_events (
  id text primary key,               -- Stripe event id, e.g. 'evt_...'
  type text not null,
  processed_at timestamptz not null default now()
);

-- ─── row level security ─────────────────────────────────────────────────
alter table collections enable row level security;
alter table products enable row level security;
alter table inventory enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table webhook_events enable row level security;

-- Public (anon) read access to the storefront catalog — this is a public shop, everyone browses it.
create policy "public can read collections" on collections for select using (true);
create policy "public can read products" on products for select using (true);
create policy "public can read inventory" on inventory for select using (true);

-- Orders and order_items: no public access at all. Only the secret-key-authenticated
-- serverless functions (checkout creation, webhook handler) can read/write these —
-- they use the service_role key, which bypasses RLS entirely, so no policy is needed
-- for them. Explicitly deny anon/authenticated here so no one can read someone else's order
-- through the public API by guessing an id.
-- (No select/insert/update policies for anon/authenticated = default deny under RLS.)

-- webhook_events: same — service_role only, no public policy.
