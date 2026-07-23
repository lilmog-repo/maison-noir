import { type MouseEvent } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { Link } from 'wouter';
import { Product } from '@/types';
import { cn } from '@/lib/utils';
import { useWishlist } from '@/context/WishlistContext';

interface ProductCardProps {
  product: Product;
  className?: string;
  large?: boolean;
}

export function ProductCard({ product, className, large = false }: ProductCardProps) {
  const { toggle, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  const handleWishlist = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(product.id);
  };

  return (
    <Link href={`/products/${product.slug}`} className={cn("group flex flex-col gap-4", className)} data-testid={`card-product-${product.id}`}>
      <div className={cn('relative overflow-hidden bg-[#F5F4F2] w-full', large ? 'aspect-[3/4]' : 'aspect-[4/5]')}>
        <motion.img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.04 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-1.5">
          {product.isNew && (
            <span className="bg-white text-primary text-[9px] tracking-[0.15em] uppercase px-2 py-1 font-medium">
              New
            </span>
          )}
          {product.isBestseller && !product.isNew && (
            <span className="bg-primary text-white text-[9px] tracking-[0.15em] uppercase px-2 py-1 font-medium">
              Bestseller
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          className={cn(
            'absolute top-4 right-4 p-2 transition-all duration-300',
            wishlisted
              ? 'opacity-100 text-accent'
              : 'opacity-0 group-hover:opacity-100 text-primary hover:text-accent',
          )}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          data-testid={`btn-wishlist-${product.id}`}
        >
          <Heart className={cn('w-5 h-5', wishlisted ? 'fill-current stroke-none' : 'stroke-[1.5]')} />
        </button>

        {/* View Piece overlay */}
        <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.22,1,0.36,1]">
          <span className="block w-full py-3 bg-white/90 backdrop-blur-sm text-primary text-[11px] tracking-[0.15em] uppercase text-center cursor-pointer">
            View Piece
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="font-serif text-lg text-primary leading-tight">{product.name}</h3>
        <p className="text-sm text-muted-foreground font-light">{product.category}</p>
        <p className="text-sm text-primary mt-1 font-medium">
          {product.originalPrice && (
            <span className="text-muted-foreground line-through mr-2 font-normal">
              €{product.originalPrice.toLocaleString()}
            </span>
          )}
          €{product.price.toLocaleString()}
        </p>
      </div>
    </Link>
  );
}
