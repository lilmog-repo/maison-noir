import { useState, useMemo, useCallback, useRef } from 'react';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, ChevronDown, X, ChevronRight } from 'lucide-react';
import { PRODUCTS, COLLECTIONS, PRICE_RANGE } from '@/lib/constants';
import { FilterState, SortOption, Product } from '@/types';
import { cn } from '@/lib/utils';
import { FilterSidebar } from '@/components/shop/FilterSidebar';
import { FilterDrawer } from '@/components/shop/FilterDrawer';
import { ShopProductCard } from '@/components/shop/ShopProductCard';

// ── Constants ──────────────────────────────────────────────────────────────

const PAGE_SIZE = 8;
const LOAD_MORE_SIZE = 4;

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low – High' },
  { value: 'price-desc', label: 'Price: High – Low' },
  { value: 'name-asc', label: 'Name: A – Z' },
];

const COLLECTION_NAMES: Record<string, string> = Object.fromEntries(
  COLLECTIONS.map((c) => [c.id, c.name]),
);

const DEFAULT_FILTERS: FilterState = {
  categories: [],
  collections: [],
  colors: [],
  minPrice: PRICE_RANGE.min,
  maxPrice: PRICE_RANGE.max,
  sizes: [],
  inStockOnly: false,
  newArrivalsOnly: false,
  bestSellersOnly: false,
  sort: 'featured',
};

// Derive all unique colors from product data
const ALL_COLORS = (() => {
  const map = new Map<string, string>();
  PRODUCTS.forEach((p) => p.colors.forEach((c) => map.set(c.name, c.hex)));
  return Array.from(map.entries()).map(([name, hex]) => ({ name, hex }));
})();

// ── Filter + Sort logic ───────────────────────────────────────────────────

function applyFilters(products: Product[], filters: FilterState, search: string): Product[] {
  const q = search.toLowerCase().trim();
  return products.filter((p) => {
    // Search
    if (q) {
      const collectionName = COLLECTION_NAMES[p.collection] ?? '';
      const haystack = `${p.name} ${p.category} ${collectionName}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    // Category
    if (filters.categories.length > 0 && !filters.categories.includes(p.category)) return false;
    // Collection
    if (filters.collections.length > 0 && !filters.collections.includes(p.collection)) return false;
    // Colors
    if (filters.colors.length > 0) {
      const productColorNames = p.colors.map((c) => c.name);
      if (!filters.colors.some((c) => productColorNames.includes(c))) return false;
    }
    // Sizes
    if (filters.sizes.length > 0) {
      if (!filters.sizes.some((s) => p.sizes.includes(s))) return false;
    }
    // Price
    if (p.price < filters.minPrice || p.price > filters.maxPrice) return false;
    // Availability
    if (filters.inStockOnly && !p.inStock) return false;
    // New
    if (filters.newArrivalsOnly && !p.isNew) return false;
    // Bestseller
    if (filters.bestSellersOnly && !p.isBestseller) return false;

    return true;
  });
}

function applySort(products: Product[], sort: SortOption): Product[] {
  const arr = [...products];
  switch (sort) {
    case 'featured':
      return arr; // original order = editorial curation
    case 'newest':
      return arr.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    case 'price-asc':
      return arr.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return arr.sort((a, b) => b.price - a.price);
    case 'bestsellers':
      return arr.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
    case 'name-asc':
      return arr.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return arr;
  }
}

// ── Active chip helpers ───────────────────────────────────────────────────

type FilterChip = { key: string; label: string; remove: () => void };

function buildChips(filters: FilterState, onChange: (p: Partial<FilterState>) => void): FilterChip[] {
  const chips: FilterChip[] = [];

  filters.categories.forEach((cat) =>
    chips.push({
      key: `cat-${cat}`,
      label: cat,
      remove: () => onChange({ categories: filters.categories.filter((c) => c !== cat) }),
    }),
  );
  filters.collections.forEach((id) =>
    chips.push({
      key: `col-${id}`,
      label: COLLECTION_NAMES[id] ?? id,
      remove: () => onChange({ collections: filters.collections.filter((c) => c !== id) }),
    }),
  );
  filters.colors.forEach((name) =>
    chips.push({
      key: `color-${name}`,
      label: name,
      remove: () => onChange({ colors: filters.colors.filter((c) => c !== name) }),
    }),
  );
  filters.sizes.forEach((s) =>
    chips.push({
      key: `size-${s}`,
      label: `Size ${s}`,
      remove: () => onChange({ sizes: filters.sizes.filter((x) => x !== s) }),
    }),
  );
  if (filters.minPrice > PRICE_RANGE.min)
    chips.push({
      key: 'price-min',
      label: `From €${filters.minPrice}`,
      remove: () => onChange({ minPrice: PRICE_RANGE.min }),
    });
  if (filters.maxPrice < PRICE_RANGE.max)
    chips.push({
      key: 'price-max',
      label: `To €${filters.maxPrice}`,
      remove: () => onChange({ maxPrice: PRICE_RANGE.max }),
    });
  if (filters.inStockOnly)
    chips.push({ key: 'in-stock', label: 'In Stock', remove: () => onChange({ inStockOnly: false }) });
  if (filters.newArrivalsOnly)
    chips.push({ key: 'new', label: 'New Arrivals', remove: () => onChange({ newArrivalsOnly: false }) });
  if (filters.bestSellersOnly)
    chips.push({ key: 'best', label: 'Bestsellers', remove: () => onChange({ bestSellersOnly: false }) });

  return chips;
}

// ── Sort Dropdown ─────────────────────────────────────────────────────────

function SortDropdown({ value, onChange }: { value: SortOption; onChange: (v: SortOption) => void }) {
  const [open, setOpen] = useState(false);
  const current = SORT_OPTIONS.find((o) => o.value === value)!;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 text-sm text-primary border border-border px-3 py-2 hover:border-primary transition-colors duration-200 min-w-[160px] justify-between"
      >
        <span className="font-light">{current.label}</span>
        <ChevronDown
          className={cn('w-3.5 h-3.5 stroke-[1.5] transition-transform duration-200 flex-shrink-0', open && 'rotate-180')}
        />
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-[39]" onClick={() => setOpen(false)} aria-hidden />
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full mt-1 bg-white border border-border shadow-lg z-40 min-w-full"
            >
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { onChange(opt.value); setOpen(false); }}
                  className={cn(
                    'block w-full text-left px-4 py-2.5 text-sm transition-colors duration-150',
                    opt.value === value
                      ? 'bg-primary text-white font-medium'
                      : 'text-foreground/80 hover:bg-[#F7F6F4] hover:text-primary font-light',
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Empty State ───────────────────────────────────────────────────────────

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-24 gap-6 text-center"
    >
      <div className="w-16 h-px bg-border mx-auto" />
      <p className="font-serif text-2xl text-primary/60">No pieces found</p>
      <p className="text-sm text-muted-foreground font-light max-w-xs leading-relaxed">
        Your current filters don't match any pieces. Try adjusting your search or clearing the active filters.
      </p>
      <button
        onClick={onClear}
        className="text-xs tracking-[0.18em] uppercase font-medium text-primary border border-primary px-8 py-3 hover:bg-primary hover:text-white transition-colors duration-300"
      >
        Clear All Filters
      </button>
    </motion.div>
  );
}

// ── Shop Page ─────────────────────────────────────────────────────────────

export default function Shop() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [search, setSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const patchFilters = useCallback((patch: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
    setVisibleCount(PAGE_SIZE); // reset pagination on filter change
  }, []);

  const clearAll = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setSearch('');
    setVisibleCount(PAGE_SIZE);
  }, []);

  // Filtered + sorted results
  const filtered = useMemo(
    () => applySort(applyFilters(PRODUCTS, filters, search), filters.sort),
    [filters, search],
  );

  const displayedProducts = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;
  const chips = useMemo(() => buildChips(filters, patchFilters), [filters, patchFilters]);

  const totalActiveFilters =
    chips.length + (search.trim() ? 1 : 0);

  return (
    <div className="min-h-screen bg-[#F7F6F4]">
      {/* ── Page header ──────────────────────────────────────────────── */}
      <section className="pt-32 pb-10 px-6 lg:px-12 container mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-muted-foreground tracking-[0.1em] uppercase mb-8" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary transition-colors duration-200">Home</Link>
          <ChevronRight className="w-3 h-3 stroke-[1.5]" />
          <span className="text-primary font-medium">Shop</span>
        </nav>

        {/* Title block */}
        <div className="flex flex-col gap-4 max-w-2xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-5xl sm:text-6xl lg:text-7xl text-primary leading-none tracking-tight"
          >
            The Edit
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-base text-foreground/60 font-light leading-relaxed"
          >
            Every piece, in one place. Refined seasonally. Chosen with intention.
          </motion.p>
        </div>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 max-w-xl"
        >
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 stroke-[1.5] text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
            <input
              ref={searchRef}
              type="search"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setVisibleCount(PAGE_SIZE); }}
              placeholder="Search pieces, categories, collections…"
              className="w-full pl-11 pr-10 py-3.5 bg-white border border-border focus:border-primary focus:outline-none text-sm font-light placeholder:text-muted-foreground/70 transition-colors duration-200"
            />
            {search && (
              <button
                onClick={() => { setSearch(''); searchRef.current?.focus(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                aria-label="Clear search"
              >
                <X className="w-4 h-4 stroke-[1.5]" />
              </button>
            )}
          </div>
        </motion.div>
      </section>

      {/* ── Main content ─────────────────────────────────────────────── */}
      <div className="container mx-auto px-6 lg:px-12 pb-24">
        <div className="flex gap-10 xl:gap-14">

          {/* Desktop sidebar */}
          <div className="hidden lg:block">
            <FilterSidebar
              filters={filters}
              onChange={patchFilters}
              allColors={ALL_COLORS}
              totalCount={filtered.length}
            />
          </div>

          {/* Product area */}
          <div className="flex-1 min-w-0">

            {/* Toolbar */}
            <div className="flex flex-col gap-4 mb-8">
              <div className="flex items-center justify-between gap-4">
                {/* Left: mobile filter button + count */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setDrawerOpen(true)}
                    className="lg:hidden flex items-center gap-2 text-sm font-medium text-primary border border-border px-4 py-2 hover:border-primary transition-colors duration-200"
                  >
                    <SlidersHorizontal className="w-4 h-4 stroke-[1.5]" />
                    Filters
                    {totalActiveFilters > 0 && (
                      <span className="bg-primary text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-semibold flex-shrink-0">
                        {totalActiveFilters}
                      </span>
                    )}
                  </button>
                  <p className="text-sm text-muted-foreground font-light">
                    {filtered.length === 0
                      ? 'No pieces'
                      : filtered.length === 1
                      ? '1 piece'
                      : `${filtered.length} pieces`}
                    {(chips.length > 0 || search) && (
                      <span className="text-muted-foreground/60"> found</span>
                    )}
                  </p>
                </div>

                {/* Right: sort */}
                <SortDropdown
                  value={filters.sort}
                  onChange={(v) => patchFilters({ sort: v })}
                />
              </div>

              {/* Active filter chips */}
              <AnimatePresence initial={false}>
                {chips.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      {chips.map((chip) => (
                        <motion.button
                          key={chip.key}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.18 }}
                          onClick={chip.remove}
                          className="flex items-center gap-1.5 text-[11px] tracking-[0.1em] uppercase font-medium text-primary bg-white border border-border hover:border-primary px-2.5 py-1.5 transition-colors duration-200 group"
                        >
                          {chip.label}
                          <X className="w-2.5 h-2.5 stroke-[2] group-hover:text-accent transition-colors" />
                        </motion.button>
                      ))}
                      <button
                        onClick={clearAll}
                        className="text-[11px] tracking-[0.1em] uppercase text-muted-foreground hover:text-primary underline underline-offset-2 transition-colors"
                      >
                        Clear all
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Product grid */}
            {filtered.length === 0 ? (
              <EmptyState onClear={clearAll} />
            ) : (
              <>
                <motion.div
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-x-5 gap-y-12"
                >
                  <AnimatePresence mode="popLayout">
                    {displayedProducts.map((product, i) => (
                      <ShopProductCard
                        key={product.id}
                        product={product}
                        index={i}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>

                {/* Load More */}
                {hasMore && (
                  <div className="mt-16 flex flex-col items-center gap-4">
                    <p className="text-xs text-muted-foreground tracking-[0.1em] uppercase">
                      Showing {displayedProducts.length} of {filtered.length}
                    </p>
                    {/* Progress bar */}
                    <div className="w-32 h-px bg-border relative">
                      <div
                        className="absolute left-0 top-0 h-full bg-primary transition-all duration-500"
                        style={{ width: `${(displayedProducts.length / filtered.length) * 100}%` }}
                      />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setVisibleCount((n) => n + LOAD_MORE_SIZE)}
                      className="mt-2 px-12 py-4 border border-primary text-primary text-xs tracking-[0.2em] uppercase font-semibold hover:bg-primary hover:text-white transition-all duration-300"
                    >
                      Load More
                    </motion.button>
                  </div>
                )}

                {/* All loaded indicator */}
                {!hasMore && filtered.length > PAGE_SIZE && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-16 flex flex-col items-center gap-3"
                  >
                    <div className="w-16 h-px bg-border" />
                    <p className="text-xs text-muted-foreground tracking-[0.15em] uppercase font-light">
                      All {filtered.length} pieces shown
                    </p>
                  </motion.div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      <FilterDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        filters={filters}
        onChange={patchFilters}
        allColors={ALL_COLORS}
        totalCount={filtered.length}
      />
    </div>
  );
}
