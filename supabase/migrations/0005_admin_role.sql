-- Maison Noir — admin role
--
-- SECURITY NOTE: profiles already has an RLS policy letting a user UPDATE
-- their own row (0004_auth_and_accounts.sql). That policy has a USING clause
-- but no WITH CHECK clause, which means — without the fix below — a signed-in
-- user could set their OWN is_admin to true via a normal authenticated
-- Supabase call, since RLS only restricted WHICH row they could touch, not
-- what values they could write. Granting admin must only ever happen via a
-- service-role (server-side) action.

-- ─── bootstrapping the first admin ──────────────────────────────────────
-- No admin exists yet after this migration runs, and by design nothing in
-- the app can grant admin (see the WITH CHECK fix above) — that's
-- intentional, but it means the very first admin has to be set directly,
-- once, via the Supabase SQL Editor (which runs as the database owner and
-- bypasses RLS entirely). After signing up for a real account through the
-- site, run this once with your own email:
--
--   update profiles set is_admin = true
--   where id = (select id from auth.users where email = 'you@example.com');
--
-- Every admin after that first one can be granted by an existing admin
-- through the admin UI itself (see src/pages/admin/Team.tsx), which calls
-- this through a service-role serverless function — never directly from
-- the browser, even for an admin.

alter table profiles add column if not exists is_admin boolean not null default false;

-- Replace the existing "own profile" update policy with one that explicitly
-- forbids changing is_admin through this policy at all. The new value of
-- is_admin must equal whatever is CURRENTLY stored for that row — so a
-- self-update can change display_name/avatar_url freely, but any attempt to
-- flip is_admin in the same request is rejected outright by RLS itself,
-- before it ever reaches application logic.
drop policy if exists "users can update own profile" on profiles;
create policy "users can update own profile" on profiles
  for update
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    and is_admin = (select p.is_admin from profiles p where p.id = auth.uid())
  );

-- Helper function other RLS policies (and application code, via rpc) can use
-- to check "is the CURRENTLY authenticated user an admin" without each
-- policy needing to repeat the same subquery.
create or replace function is_admin()
returns boolean
language sql
security definer
stable
as $$
  select coalesce((select p.is_admin from profiles p where p.id = auth.uid()), false);
$$;

-- ─── admin read/write access to orders and order_items ────────────────
-- Admins can see and update ALL orders, not just their own — needed for
-- "mark shipped" style order management.
create policy "admins can view all orders" on orders
  for select using (is_admin());
create policy "admins can update orders" on orders
  for update using (is_admin());

create policy "admins can view all order items" on order_items
  for select using (is_admin());

-- ─── admin write access to products and inventory ──────────────────────
-- Regular customers can already SELECT products/inventory (public catalog,
-- from 0001_init.sql). Admins additionally get insert/update/delete.
create policy "admins can insert products" on products
  for insert with check (is_admin());
create policy "admins can update products" on products
  for update using (is_admin());
create policy "admins can delete products" on products
  for delete using (is_admin());

create policy "admins can insert collections" on collections
  for insert with check (is_admin());
create policy "admins can update collections" on collections
  for update using (is_admin());

create policy "admins can insert inventory" on inventory
  for insert with check (is_admin());
create policy "admins can update inventory" on inventory
  for update using (is_admin());
