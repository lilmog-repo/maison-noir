import { createContext, useContext, useReducer, useEffect, useRef, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

interface WishlistState {
  productIds: string[];
}

type WishlistAction =
  | { type: 'TOGGLE'; productId: string }
  | { type: 'LOAD'; productIds: string[] };

function wishlistReducer(state: WishlistState, action: WishlistAction): WishlistState {
  switch (action.type) {
    case 'TOGGLE':
      return {
        productIds: state.productIds.includes(action.productId)
          ? state.productIds.filter((id) => id !== action.productId)
          : [...state.productIds, action.productId],
      };
    case 'LOAD':
      return { productIds: action.productIds };
    default:
      return state;
  }
}

interface WishlistContextValue {
  productIds: string[];
  toggle: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  count: number;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);
const WISHLIST_KEY = 'maison-noir-wishlist';

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(wishlistReducer, { productIds: [] });
  const { user, isLoading: authLoading } = useAuth();
  // Tracks whether we've already merged the guest (localStorage) wishlist
  // into the account on this sign-in, so we don't re-merge on every render.
  const hasMergedForUserId = useRef<string | null>(null);

  // Signed OUT: behave exactly like before — localStorage only.
  useEffect(() => {
    if (authLoading || user) return;
    try {
      const stored = localStorage.getItem(WISHLIST_KEY);
      if (stored) dispatch({ type: 'LOAD', productIds: JSON.parse(stored) });
    } catch {
      /* ignore corrupt localStorage */
    }
  }, [authLoading, user]);

  useEffect(() => {
    if (user) return; // signed-in state is persisted to Supabase instead, below
    try {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(state.productIds));
    } catch {
      /* storage full or unavailable — non-fatal */
    }
  }, [state.productIds, user]);

  // Signed IN: load from Supabase, and on the FIRST sign-in of this session,
  // merge in whatever was in the guest localStorage wishlist (so wishlisting
  // something before logging in isn't lost).
  useEffect(() => {
    if (authLoading || !user) return;

    let cancelled = false;

    (async () => {
      const { data, error } = await supabase
        .from('wishlist_items')
        .select('product_id')
        .eq('user_id', user.id);

      if (error || cancelled) return;

      const remoteIds = (data ?? []).map((r) => r.product_id);

      if (hasMergedForUserId.current !== user.id) {
        hasMergedForUserId.current = user.id;
        let guestIds: string[] = [];
        try {
          const stored = localStorage.getItem(WISHLIST_KEY);
          if (stored) guestIds = JSON.parse(stored);
        } catch {
          /* ignore corrupt localStorage */
        }
        const toMerge = guestIds.filter((id) => !remoteIds.includes(id));
        if (toMerge.length > 0) {
          await supabase
            .from('wishlist_items')
            .insert(toMerge.map((product_id) => ({ user_id: user.id, product_id })));
          localStorage.removeItem(WISHLIST_KEY);
          if (!cancelled) dispatch({ type: 'LOAD', productIds: [...remoteIds, ...toMerge] });
          return;
        }
      }

      if (!cancelled) dispatch({ type: 'LOAD', productIds: remoteIds });
    })();

    return () => {
      cancelled = true;
    };
  }, [authLoading, user]);

  const toggle = async (productId: string) => {
    const wasWishlisted = state.productIds.includes(productId);
    dispatch({ type: 'TOGGLE', productId }); // optimistic local update

    if (!user) return; // guest: localStorage effect above handles persistence

    if (wasWishlisted) {
      await supabase.from('wishlist_items').delete().eq('user_id', user.id).eq('product_id', productId);
    } else {
      await supabase.from('wishlist_items').insert({ user_id: user.id, product_id: productId });
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        productIds: state.productIds,
        toggle,
        isWishlisted: (productId) => state.productIds.includes(productId),
        count: state.productIds.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}

