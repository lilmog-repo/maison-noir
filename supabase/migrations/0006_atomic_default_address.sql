-- Maison Noir — atomic default-address switching
--
-- WHY THIS EXISTS: Account.tsx previously cleared any existing default
-- address, then separately inserted/updated the new one, as two round trips
-- from the browser. Between those two calls, there's a real window where the
-- user has ZERO default addresses — if the second call fails, the network
-- drops, or the tab closes, that inconsistency persists silently. Doing both
-- steps inside one function call means Postgres runs them as a single
-- transaction: either both happen, or neither does.
--
-- This mirrors the same reasoning as decrement_inventory() in
-- 0003_inventory_rpc.sql — a correctness property that belongs at the
-- database layer, not reconstructed with extra application-code round trips.

create or replace function set_default_address(p_address_id uuid)
returns void
language plpgsql
security invoker  -- runs as the calling (authenticated) user, so RLS on
                   -- addresses still applies — this function can't be used
                   -- to touch a different user's rows even if someone finds
                   -- the address id
as $$
declare
  v_user_id uuid := auth.uid();
begin
  if v_user_id is null then
    raise exception 'set_default_address: no authenticated user';
  end if;

  -- Confirm the target address actually belongs to the caller BEFORE
  -- touching anything — without this check, a user could pass any address
  -- id and (thanks to RLS on the UPDATE below only checking rows it
  -- actually touches) simply have the update silently affect zero rows
  -- while still having already cleared their OWN defaults above it, which
  -- would be a confusing partial-failure state.
  if not exists (
    select 1 from addresses where id = p_address_id and user_id = v_user_id
  ) then
    raise exception 'set_default_address: address not found or not owned by caller';
  end if;

  update addresses
  set is_default = false
  where user_id = v_user_id
    and is_default = true
    and id != p_address_id;

  update addresses
  set is_default = true
  where id = p_address_id
    and user_id = v_user_id;
end;
$$;
