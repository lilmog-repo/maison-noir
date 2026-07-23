import { useState, useCallback, type MouseEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, Check } from 'lucide-react';
import { Link } from 'wouter';
import { Product } from '@/types';
import { cn } from '@/lib/utils';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';

interface ShopProductCardProps {
  product: Product;
  index?: number;
  className?: string;
}

export function ShopProductCard({ product, index = 0, className }: ShopProductCardProps) {
  const { toggle, isWishlisted } = useWishlist();
  const { addItem } = useCart();
  const wishlisted = isWishlisted(product.id);

  const [hoveredSize, setHoveredSize] = useState<string | null>(null);
  const [addedSize, setAddedSize] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const secondImage = product.images[1] ?? null;

  const handleWishlist = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(product.id);
  };

  const handleQuickAdd = useCallback(
    (e: MouseEvent, size: string) => {
      e.preventDefault();
      e.stopPropagation();
      const color = product.colors[0];
      addItem(product, size, color, 1);
      setAddedSize(size);
      setTimeout(() => setAddedSize(null), 1800);
    },
    [addItem, product],
  );

  const hasSizes = product.sizes.length > 0;
  const isOneSize = product.sizes.length === 1 && product.sizes[0] === 'One Size';

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: Math.min(index * 0.06, 0.36), ease: [0.22, 1, 0.36, 1] }}
      className={cn('group flex flex-col gap-3', className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setHoveredSize(null); }}
    >
      {/* Image container */}
      <Link href={`/products/${product.slug}`} className="relative block overflow-hidden bg-[#F5F4F2] aspect-[3/4]">
        {/* Primary image */}
        <motion.img
          src={product.imageUrl}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover"
          animate={{ scale: isHovered ? 1.05 : 1, opacity: (isHovered && secondImage) ? 0 : 1 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          loading="lazy"
        />

        {/* Hover image */}
        {secondImage && (
          <motion.img
            src={secondImage}
            alt={`${product.name} — alternate view`}
            className="absolute inset-0 w-full h-full object-cover"
            animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            loading="lazy"
          />
        )}

        {/* Out of stock veil */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center pointer-events-none">
            <span className="text-[10px] tracking-[0.2em] uppercase text-primary/60 font-medium bg-white/80 px-3 py-1.5">
              Sold Out
            </span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isNew && (
            <span className="bg-white text-primary text-[9px] tracking-[0.15em] uppercase px-2.5 py-1 font-semibold shadow-sm">
              New
            </span>
          )}
          {product.isBestseller && !product.isNew && (
            <span className="bg-primary text-white text-[9px] tracking-[0.15em] uppercase px-2.5 py-1 font-semibold">
              Bestseller
            </span>
          )}
        </div>

        {/* Wishlist button */}
        <button
          onClick={handleWishlist}
          className={cn(
            'absolute top-3 right-3 p-2 transition-all duration-300',
            wishlisted
              ? 'opacity-100 text-accent'
              : 'opacity-0 group-hover:opacity-100 text-primary hover:text-accent',
          )}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          data-testid={`btn-wishlist-${product.id}`}
        >
          <Heart className={cn('w-5 h-5', wishlisted ? 'fill-current stroke-none' : 'stroke-[1.5]')} />
        </button>

        {/* Quick Add overlay */}
        <AnimatePresence>
          {isHovered && product.inStock && (
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm p-3"
              onClick={(e) => e.preventDefault()}
            >
              {isOneSize ? (
                // One Size — direct add
                <button
                  onClick={(e) => handleQuickAdd(e, 'One Size')}
                  className="w-full flex items-center justify-center gap-2 py-2.5 text-[10px] tracking-[0.18em] uppercase font-semibold text-primary hover:text-accent transition-colors"
                >
                  {addedSize === 'One Size' ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Added to Bag
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-3.5 h-3.5 stroke-[1.75]" />
                      Add to Bag
                    </>
                  )}
                </button>
              ) : hasSizes ? (
                // Size selector
                <div className="flex flex-col gap-2">
                  <p className="text-[9px] tracking-[0.15em] uppercase text-muted-foreground text-center font-medium">
                    Select Size
                  </p>
                  <div className="flex items-center justify-center gap-1.5 flex-wrap">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={(e) => handleQuickAdd(e, size)}
                        onMouseEnter={() => setHoveredSize(size)}
                        onMouseLeave={() => setHoveredSize(null)}
                        className={cn(
                          'min-w-[36px] h-8 px-2 text-[10px] tracking-wider uppercase border transition-all duration-200 font-medium',
                          addedSize === size
                            ? 'border-accent bg-accent text-white'
                            : hoveredSize === size
                            ? 'border-primary bg-primary text-white'
                            : 'border-border text-primary hover:border-primary',
                        )}
                      >
                        {addedSize === size ? <Check className="w-3 h-3 mx-auto" /> : size}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>
      </Link>

      {/* Info */}
      <div className="flex flex-col gap-1 px-0.5">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-serif text-base sm:text-lg text-primary leading-tight hover:text-accent transition-colors duration-200">
              {product.name}
            </h3>
          </Link>
        </div>
        <p className="text-xs text-muted-foreground uppercase tracking-[0.1em] font-light">
          {product.category}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          {product.originalPrice && (
            <span className="text-xs text-muted-foreground line-through font-light">
              €{product.originalPrice.toLocaleString()}
            </span>
          )}
          <span className={cn('text-sm font-medium', product.originalPrice ? 'text-accent' : 'text-primary')}>
            €{product.price.toLocaleString()}
          </span>
        </div>

        {/* Color swatches */}
        {product.colors.length > 1 && (
          <div className="flex items-center gap-1.5 mt-1">
            {product.colors.slice(0, 5).map((c) => (
              <span
                key={c.name}
                title={c.name}
                className="w-3 h-3 rounded-full border border-border/60 flex-shrink-0"
                style={{ backgroundColor: c.hex }}
              />
            ))}
            {product.colors.length > 5 && (
              <span className="text-[10px] text-muted-foreground">+{product.colors.length - 5}</span>
            )}
          </div>
        )}
      </div>
    </motion.article>
  );
}
