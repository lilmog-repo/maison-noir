-- Atomic inventory decrement, callable via supabase.rpc('decrement_inventory', {...}).
--
-- Why this exists as a DB function rather than a plain UPDATE from application code:
-- a naive "read current quantity, then write quantity - n" from JS has a race condition —
-- two simultaneous checkouts for the last unit of a size/color can both read "1 in stock"
-- before either write lands, and both succeed, overselling by one. Doing the check and the
-- decrement in a single UPDATE statement inside one function call closes that gap: Postgres
-- serializes concurrent UPDATEs to the same row, so the second caller sees the first caller's
-- decrement before it evaluates its own WHERE clause.
--
-- This runs AFTER payment is already confirmed (called from the webhook), so it deliberately
-- does not fail loudly if stock is insufficient — the sale already happened. It decrements
-- floor-clamped at zero and returns whether it could fully satisfy the request, so the caller
-- can log an oversell for manual follow-up rather than lose the write entirely.

create or replace function decrement_inventory(
  p_product_id text,
  p_size text,
  p_color_name text,
  p_quantity integer
) returns boolean
language plpgsql
security definer
as $$
declare
  v_updated_rows integer;
begin
  update inventory
  set quantity = greatest(quantity - p_quantity, 0),
      updated_at = now()
  where product_id = p_product_id
    and size = p_size
    and color_name = p_color_name
    and quantity >= p_quantity;

  get diagnostics v_updated_rows = row_count;

  if v_updated_rows = 0 then
    -- Either the row doesn't exist, or there wasn't enough stock to fully cover
    -- p_quantity at the moment this ran (shouldn't normally happen since checkout
    -- already checked availability, but payment can complete slightly later than
    -- the check). Fall back to a floor-clamped decrement so inventory doesn't go
    -- negative or silently drift out of sync, and flag it for review.
    update inventory
    set quantity = 0,
        updated_at = now()
    where product_id = p_product_id
      and size = p_size
      and color_name = p_color_name
      and quantity < p_quantity;

    raise warning 'decrement_inventory: insufficient stock for % % % (requested %)',
      p_product_id, p_size, p_color_name, p_quantity;
    return false;
  end if;

  return true;
end;
$$;
