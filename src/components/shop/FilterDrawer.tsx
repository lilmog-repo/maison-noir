import { useEffect, useId, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { FilterState } from '@/types';
import { ALL_CATEGORIES, ALL_SIZES, COLLECTIONS, PRICE_RANGE } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { ProductColor } from '@/types';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onChange: (patch: Partial<FilterState>) => void;
  allColors: ProductColor[];
  totalCount: number;
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-[10px] tracking-[0.2em] uppercase font-semibold text-primary/70 mb-3">
      {children}
    </p>
  );
}

function CheckRow({ label, checked, onToggle }: { label: string; checked: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-3 w-full py-2 group"
      aria-pressed={checked}
    >
      <span
        className={cn(
          'w-4 h-4 border flex-shrink-0 flex items-center justify-center transition-colors duration-200',
          checked ? 'bg-primary border-primary' : 'border-border group-hover:border-primary',
        )}
      >
        {checked && (
          <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 8" fill="none">
            <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span className={cn('text-sm', checked ? 'text-primary font-medium' : 'text-foreground/75 font-light')}>
        {label}
      </span>
    </button>
  );
}

function DrawerSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="py-5 border-b border-border/50">
      <SectionLabel>{title}</SectionLabel>
      {children}
    </div>
  );
}

export function FilterDrawer({ isOpen, onClose, filters, onChange, allColors, totalCount }: FilterDrawerProps) {
  const priceId = useId();

  // Lock body scroll while open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const toggleCategory = (cat: string) => {
    const next = filters.categories.includes(cat)
      ? filters.categories.filter((c) => c !== cat)
      : [...filters.categories, cat];
    onChange({ categories: next });
  };

  const toggleCollection = (id: string) => {
    const next = filters.collections.includes(id)
      ? filters.collections.filter((c) => c !== id)
      : [...filters.collections, id];
    onChange({ collections: next });
  };

  const toggleSize = (s: string) => {
    const next = filters.sizes.includes(s)
      ? filters.sizes.filter((x) => x !== s)
      : [...filters.sizes, s];
    onChange({ sizes: next });
  };

  const toggleColor = (name: string) => {
    const next = filters.colors.includes(name)
      ? filters.colors.filter((c) => c !== name)
      : [...filters.colors, name];
    onChange({ colors: next });
  };

  const activeCount =
    filters.categories.length +
    filters.collections.length +
    filters.sizes.length +
    filters.colors.length +
    (filters.inStockOnly ? 1 : 0) +
    (filters.newArrivalsOnly ? 1 : 0) +
    (filters.bestSellersOnly ? 1 : 0) +
    (filters.minPrice > PRICE_RANGE.min ? 1 : 0) +
    (filters.maxPrice < PRICE_RANGE.max ? 1 : 0);

  const clearAll = () =>
    onChange({
      categories: [],
      collections: [],
      sizes: [],
      colors: [],
      minPrice: PRICE_RANGE.min,
      maxPrice: PRICE_RANGE.max,
      inStockOnly: false,
      newArrivalsOnly: false,
      bestSellersOnly: false,
    });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/40 z-[70] lg:hidden"
            onClick={onClose}
            aria-hidden
          />

          {/* Drawer panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-0 left-0 z-[80] w-[320px] max-w-[90vw] bg-white flex flex-col lg:hidden shadow-2xl"
            role="dialog"
            aria-label="Filter products"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <div>
                <h2 className="font-serif text-xl text-primary">Filters</h2>
                <p className="text-xs text-muted-foreground mt-0.5">{totalCount} pieces</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 -mr-2 text-primary hover:text-accent transition-colors"
                aria-label="Close filters"
              >
                <X className="w-5 h-5 stroke-[1.5]" />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-6 pb-6">

              <DrawerSection title="Category">
                <div className="flex flex-col">
                  {ALL_CATEGORIES.map((cat) => (
                    <CheckRow
                      key={cat}
                      label={cat}
                      checked={filters.categories.includes(cat)}
                      onToggle={() => toggleCategory(cat)}
                    />
                  ))}
                </div>
              </DrawerSection>

              <DrawerSection title="Collection">
                <div className="flex flex-col">
                  {COLLECTIONS.map((col) => (
                    <CheckRow
                      key={col.id}
                      label={col.name}
                      checked={filters.collections.includes(col.id)}
                      onToggle={() => toggleCollection(col.id)}
                    />
                  ))}
                </div>
              </DrawerSection>

              <DrawerSection title="Price Range">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-1 relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">€</span>
                    <input
                      id={`${priceId}-min`}
                      type="number"
                      min={PRICE_RANGE.min}
                      max={filters.maxPrice}
                      value={filters.minPrice}
                      onChange={(e) => onChange({ minPrice: Math.max(PRICE_RANGE.min, Number(e.target.value)) })}
                      className="w-full pl-6 pr-2 py-2.5 text-sm border border-border bg-transparent focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <span className="text-muted-foreground flex-shrink-0">–</span>
                  <div className="flex-1 relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">€</span>
                    <input
                      id={`${priceId}-max`}
                      type="number"
                      min={filters.minPrice}
                      max={PRICE_RANGE.max}
                      value={filters.maxPrice}
                      onChange={(e) => onChange({ maxPrice: Math.min(PRICE_RANGE.max, Number(e.target.value)) })}
                      className="w-full pl-6 pr-2 py-2.5 text-sm border border-border bg-transparent focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>
                {/* Track */}
                <div className="relative h-0.5 bg-border rounded-full">
                  <div
                    className="absolute h-full bg-primary rounded-full"
                    style={{
                      left: `${(filters.minPrice / PRICE_RANGE.max) * 100}%`,
                      right: `${100 - (filters.maxPrice / PRICE_RANGE.max) * 100}%`,
                    }}
                  />
                </div>
              </DrawerSection>

              <DrawerSection title="Size">
                <div className="flex flex-wrap gap-2">
                  {ALL_SIZES.map((s) => (
                    <button
                      key={s}
                      onClick={() => toggleSize(s)}
                      className={cn(
                        'min-w-[42px] h-10 px-3 text-[11px] tracking-wider uppercase border transition-all duration-200 font-medium',
                        filters.sizes.includes(s)
                          ? 'bg-primary text-white border-primary'
                          : 'border-border text-foreground/70 hover:border-primary hover:text-primary',
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </DrawerSection>

              {allColors.length > 0 && (
                <DrawerSection title="Colour">
                  <div className="flex flex-wrap gap-3">
                    {allColors.map((c) => (
                      <button
                        key={c.name}
                        title={c.name}
                        onClick={() => toggleColor(c.name)}
                        className={cn(
                          'relative w-7 h-7 rounded-full border-2 transition-all duration-200 flex-shrink-0',
                          filters.colors.includes(c.name)
                            ? 'border-primary scale-110'
                            : 'border-transparent hover:border-primary/40',
                        )}
                        style={{ backgroundColor: c.hex }}
                        aria-pressed={filters.colors.includes(c.name)}
                        aria-label={c.name}
                      >
                        {filters.colors.includes(c.name) && (
                          <span className="absolute inset-0 flex items-center justify-center">
                            <svg className="w-3 h-3" viewBox="0 0 10 8" fill="none">
                              <path
                                d="M1 4l3 3 5-6"
                                stroke={['#111111', '#0D0D0D', '#1A1A2E', '#4A1942', '#800020'].includes(c.hex) ? '#fff' : '#111'}
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </DrawerSection>
              )}

              <DrawerSection title="Availability">
                <div className="flex flex-col">
                  <CheckRow
                    label="In Stock"
                    checked={filters.inStockOnly}
                    onToggle={() => onChange({ inStockOnly: !filters.inStockOnly })}
                  />
                  <CheckRow
                    label="New Arrivals"
                    checked={filters.newArrivalsOnly}
                    onToggle={() => onChange({ newArrivalsOnly: !filters.newArrivalsOnly })}
                  />
                  <CheckRow
                    label="Bestsellers"
                    checked={filters.bestSellersOnly}
                    onToggle={() => onChange({ bestSellersOnly: !filters.bestSellersOnly })}
                  />
                </div>
              </DrawerSection>
            </div>

            {/* Footer actions */}
            <div className="px-6 py-4 border-t border-border flex gap-3">
              {activeCount > 0 && (
                <button
                  onClick={clearAll}
                  className="flex-1 py-3 border border-border text-sm tracking-[0.1em] uppercase text-primary hover:border-primary transition-colors font-medium"
                >
                  Clear All ({activeCount})
                </button>
              )}
              <button
                onClick={onClose}
                className="flex-1 py-3 bg-primary text-white text-sm tracking-[0.1em] uppercase hover:bg-primary/90 transition-colors font-medium"
              >
                View {totalCount} Pieces
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
