import { useMemo } from 'react';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ChevronRight } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PRODUCTS } from '@/lib/constants';
import { useWishlist } from '@/context/WishlistContext';
import { ShopProductCard } from '@/components/shop/ShopProductCard';

export default function Wishlist() {
  const { productIds } = useWishlist();

  const wishlistProducts = useMemo(
    () => PRODUCTS.filter((p) => productIds.includes(p.id)),
    [productIds],
  );

  const isEmpty = wishlistProducts.length === 0;

  return (
    <div className="min-h-[100dvh] flex flex-col bg-[#F7F6F4]">
      <Navbar />

      <main className="flex-1 pt-24">
        {/* Header */}
        <section className="container mx-auto px-6 lg:px-12 pt-8 pb-12">
          <nav
            className="flex items-center gap-2 text-xs text-muted-foreground tracking-[0.1em] uppercase mb-8"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-primary font-medium">Wishlist</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                className="font-serif text-5xl sm:text-6xl text-primary leading-none tracking-tight"
              >
                Your Wishlist
              </motion.h1>
              {!isEmpty && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                  className="text-sm text-muted-foreground font-light mt-3"
                >
                  {wishlistProducts.length} saved {wishlistProducts.length === 1 ? 'piece' : 'pieces'}
                </motion.p>
              )}
            </div>
            {!isEmpty && (
              <Link href="/shop">
                <button className="text-xs tracking-[0.15em] uppercase font-medium text-primary border-b border-primary pb-0.5 hover:text-accent hover:border-accent transition-colors">
                  Continue Shopping
                </button>
              </Link>
            )}
          </div>
        </section>

        {/* Content */}
        <section className="container mx-auto px-6 lg:px-12 pb-28">
          <AnimatePresence mode="wait">
            {isEmpty ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-center justify-center text-center py-24 gap-6"
              >
                <Heart className="w-10 h-10 text-border stroke-[1]" />
                <div className="w-12 h-px bg-border" />
                <p className="font-serif text-3xl text-primary/50">Nothing saved yet</p>
                <p className="text-sm text-muted-foreground font-light max-w-xs leading-relaxed">
                  Tap the heart on any piece to save it here. Your wishlist is stored locally and
                  stays between visits.
                </p>
                <Link href="/shop">
                  <button className="mt-4 px-10 py-4 bg-primary text-white text-xs tracking-[0.2em] uppercase font-semibold hover:bg-primary/90 transition-colors duration-300">
                    Browse the Edit
                  </button>
                </Link>
              </motion.div>
            ) : (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-12">
                  <AnimatePresence>
                    {wishlistProducts.map((product, i) => (
                      <ShopProductCard key={product.id} product={product} index={i} />
                    ))}
                  </AnimatePresence>
                </div>

                {/* Discover more */}
                <div className="mt-20 pt-12 border-t border-border text-center">
                  <p className="text-sm text-foreground/50 font-light mb-6">
                    Looking for more? The full edit is waiting.
                  </p>
                  <Link href="/shop">
                    <button className="px-10 py-4 border border-primary text-primary text-xs tracking-[0.2em] uppercase font-semibold hover:bg-primary hover:text-white transition-all duration-300">
                      Shop All Pieces
                    </button>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>

      <Footer />
    </div>
  );
}
