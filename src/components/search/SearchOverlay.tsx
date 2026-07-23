import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search } from 'lucide-react';
import { Link } from 'wouter';
import { PRODUCTS, COLLECTIONS } from '@/lib/constants';

// Build a lookup from collection id → name for readable search
const COLLECTION_NAMES: Record<string, string> = Object.fromEntries(
  COLLECTIONS.map((c) => [c.id, c.name]),
);

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Small delay so the AnimatePresence mount finishes before focusing
      const t = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(t);
    } else {
      document.body.style.overflow = '';
      setQuery('');
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [isOpen, onClose]);

  const q = query.trim().toLowerCase();
  const results = q
    ? PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (COLLECTION_NAMES[p.collection] || '').toLowerCase().includes(q) ||
          (p.description || '').toLowerCase().includes(q),
      )
    : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] bg-background flex flex-col"
        >
          {/* Search bar */}
          <div className="border-b border-border">
            <div className="container mx-auto px-6 lg:px-12 py-5 flex items-center gap-4">
              <Search className="w-5 h-5 text-muted-foreground flex-shrink-0 stroke-[1.5]" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search pieces, categories, collections…"
                className="flex-1 text-lg lg:text-2xl font-serif tracking-wide bg-transparent focus:outline-none placeholder:text-muted-foreground/40"
                aria-label="Search"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="text-xs text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest"
                >
                  Clear
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1 text-primary hover:text-accent transition-colors ml-2"
                aria-label="Close search"
              >
                <X className="w-6 h-6 stroke-[1.5]" />
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1 overflow-y-auto">
            <div className="container mx-auto px-6 lg:px-12 py-8">
              {q ? (
                results.length > 0 ? (
                  <>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest mb-8">
                      {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                      {results.map((product) => (
                        <Link
                          key={product.id}
                          href={`/products/${product.slug}`}
                          onClick={onClose}
                          className="group flex flex-col gap-3"
                          data-testid={`search-result-${product.id}`}
                        >
                          <div className="aspect-[4/5] bg-[#F5F4F2] overflow-hidden">
                            <motion.img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              whileHover={{ scale: 1.04 }}
                              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            />
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <p className="font-serif text-base text-primary leading-tight">{product.name}</p>
                            <p className="text-xs text-muted-foreground font-light">{product.category}</p>
                            <p className="text-sm text-primary font-medium mt-0.5">€{product.price.toLocaleString()}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center py-24 text-center"
                  >
                    <p className="font-serif text-2xl lg:text-3xl text-muted-foreground mb-3">
                      No results for "{query}"
                    </p>
                    <p className="text-sm text-muted-foreground font-light">
                      Try a different term or browse the{' '}
                      <Link href="/shop" onClick={onClose} className="underline underline-offset-4 hover:text-primary transition-colors">
                        full collection
                      </Link>
                      .
                    </p>
                  </motion.div>
                )
              ) : (
                /* Idle state — surface category shortcuts */
                <div className="py-12">
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mb-6">Browse by category</p>
                  <div className="flex flex-wrap gap-3">
                    {['Outerwear', 'Tops', 'Bottoms', 'Dresses', 'Accessories', 'Knitwear'].map((cat) => (
                      <Link
                        key={cat}
                        href={`/shop`}
                        onClick={onClose}
                        className="px-5 py-2.5 border border-border text-sm tracking-wide hover:border-primary hover:text-primary transition-colors"
                      >
                        {cat}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
