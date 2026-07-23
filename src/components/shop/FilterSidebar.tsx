import { useId, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { FilterState } from '@/types';
import { ALL_CATEGORIES, ALL_SIZES, COLLECTIONS, PRICE_RANGE } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { ProductColor } from '@/types';

interface FilterSidebarProps {
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

function Divider() {
  return <div className="border-t border-border/50 my-5" />;
}

function CheckRow({
  label,
  checked,
  onToggle,
  count,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
  count?: number;
}) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center justify-between w-full group py-1"
      aria-pressed={checked}
    >
      <span className="flex items-center gap-2.5">
        <span
          className={cn(
            'w-3.5 h-3.5 border flex-shrink-0 flex items-center justify-center transition-colors duration-200',
            checked ? 'bg-primary border-primary' : 'border-border group-hover:border-primary',
          )}
        >
          {checked && (
            <svg className="w-2 h-2 text-white" viewBox="0 0 10 8" fill="none">
              <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
        <span className={cn('text-sm transition-colors duration-200', checked ? 'text-primary font-medium' : 'text-foreground/75 group-hover:text-primary font-light')}>
          {label}
        </span>
      </span>
      {count !== undefined && (
        <span className="text-[11px] text-muted-foreground">{count}</span>
      )}
    </button>
  );
}

export function FilterSidebar({ filters, onChange, allColors, totalCount }: FilterSidebarProps) {
  const priceInputId = useId();

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

  return (
    <motion.aside
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="w-[220px] xl:w-[240px] flex-shrink-0"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[10px] tracking-[0.25em] uppercase font-semibold text-primary">
          Filters
        </h2>
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-muted-foreground">{totalCount} pieces</span>
          {activeCount > 0 && (
            <button
              onClick={() =>
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
                })
              }
              className="text-[10px] tracking-[0.1em] uppercase text-accent hover:text-accent/70 transition-colors underline underline-offset-2"
            >
              Clear ({activeCount})
            </button>
          )}
        </div>
      </div>

      {/* Category */}
      <div>
        <SectionLabel>Category</SectionLabel>
        <div className="flex flex-col gap-0.5">
          {ALL_CATEGORIES.map((cat) => (
            <CheckRow
              key={cat}
              label={cat}
              checked={filters.categories.includes(cat)}
              onToggle={() => toggleCategory(cat)}
            />
          ))}
        </div>
      </div>

      <Divider />

      {/* Collections */}
      <div>
        <SectionLabel>Collection</SectionLabel>
        <div className="flex flex-col gap-0.5">
          {COLLECTIONS.map((col) => (
            <CheckRow
              key={col.id}
              label={col.name}
              checked={filters.collections.includes(col.id)}
              onToggle={() => toggleCollection(col.id)}
            />
          ))}
        </div>
      </div>

      <Divider />

      {/* Price */}
      <div>
        <SectionLabel>Price Range</SectionLabel>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <label htmlFor={`${priceInputId}-min`} className="sr-only">Min price</label>
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[11px] text-muted-foreground">€</span>
              <input
                id={`${priceInputId}-min`}
                type="number"
                min={PRICE_RANGE.min}
                max={filters.maxPrice}
                value={filters.minPrice}
                onChange={(e) => onChange({ minPrice: Math.max(PRICE_RANGE.min, Number(e.target.value)) })}
                className="w-full pl-5 pr-2 py-2 text-xs border border-border bg-transparent focus:outline-none focus:border-primary transition-colors"
                placeholder="0"
              />
            </div>
          </div>
          <span className="text-muted-foreground text-xs flex-shrink-0">–</span>
          <div className="flex-1">
            <label htmlFor={`${priceInputId}-max`} className="sr-only">Max price</label>
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[11px] text-muted-foreground">€</span>
              <input
                id={`${priceInputId}-max`}
                type="number"
                min={filters.minPrice}
                max={PRICE_RANGE.max}
                value={filters.maxPrice}
                onChange={(e) => onChange({ maxPrice: Math.min(PRICE_RANGE.max, Number(e.target.value)) })}
                className="w-full pl-5 pr-2 py-2 text-xs border border-border bg-transparent focus:outline-none focus:border-primary transition-colors"
                placeholder="2000"
              />
            </div>
          </div>
        </div>

        {/* Range slider track (visual only) */}
        <div className="mt-3 relative h-0.5 bg-border rounded-full">
          <div
            className="absolute h-full bg-primary rounded-full"
            style={{
              left: `${(filters.minPrice / PRICE_RANGE.max) * 100}%`,
              right: `${100 - (filters.maxPrice / PRICE_RANGE.max) * 100}%`,
            }}
          />
        </div>
      </div>

      <Divider />

      {/* Sizes */}
      <div>
        <SectionLabel>Size</SectionLabel>
        <div className="flex flex-wrap gap-1.5">
          {ALL_SIZES.map((s) => (
            <button
              key={s}
              onClick={() => toggleSize(s)}
              className={cn(
                'min-w-[36px] h-8 px-2 text-[10px] tracking-wider uppercase border transition-all duration-200 font-medium',
                filters.sizes.includes(s)
                  ? 'bg-primary text-white border-primary'
                  : 'border-border text-foreground/70 hover:border-primary hover:text-primary',
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <Divider />

      {/* Colors */}
      {allColors.length > 0 && (
        <>
          <div>
            <SectionLabel>Colour</SectionLabel>
            <div className="flex flex-wrap gap-2">
              {allColors.map((c) => (
                <button
                  key={c.name}
                  title={c.name}
                  onClick={() => toggleColor(c.name)}
                  className={cn(
                    'relative w-6 h-6 rounded-full border-2 transition-all duration-200 flex-shrink-0',
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
                      <svg className="w-2.5 h-2.5" viewBox="0 0 10 8" fill="none">
                        <path
                          d="M1 4l3 3 5-6"
                          stroke={c.hex === '#111111' || c.hex === '#0D0D0D' || c.hex === '#1A1A2E' || c.hex === '#4A1942' || c.hex === '#800020' ? '#fff' : '#111'}
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
          </div>
          <Divider />
        </>
      )}

      {/* Availability & Toggles */}
      <div>
        <SectionLabel>Availability</SectionLabel>
        <div className="flex flex-col gap-0.5">
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
      </div>
    </motion.aside>
  );
}
