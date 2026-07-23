import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Search, Heart, ShoppingBag, User, Menu, X } from 'lucide-react';
import { NAV_ITEMS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { SearchOverlay } from '@/components/search/SearchOverlay';
import { CartDrawer } from '@/components/cart/CartDrawer';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [location] = useLocation();

  const { totalItems, openCart } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { user } = useAuth();

  const isHome = location === '/' || location === '';
  const useLightText = isHome && !isScrolled;

  // Active link check — match exact or sub-path (but not '/' for sub-paths)
  const isActive = (href: string) =>
    location === href || (href.length > 1 && location.startsWith(href));

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const iconCls = cn(
    'transition-colors duration-300',
    useLightText ? 'text-white/90 hover:text-white' : 'text-primary hover:text-accent',
  );

  return (
    <>
      <header
        className={cn(
          'fixed top-0 w-full z-50 transition-all duration-500 ease-[0.22,1,0.36,1]',
          isScrolled
            ? 'bg-white border-b border-border/60 py-4 shadow-[0_1px_12px_rgba(0,0,0,0.06)]'
            : 'bg-transparent py-6',
        )}
      >
        <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between">

          {/* Mobile hamburger */}
          <button
            className={cn('lg:hidden transition-colors duration-300', useLightText ? 'text-white/90' : 'text-primary')}
            onClick={() => setMobileMenuOpen(true)}
            data-testid="btn-mobile-menu"
            aria-label="Open navigation"
          >
            <Menu className="w-6 h-6 stroke-[1.5]" />
          </button>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8 w-1/3" aria-label="Main navigation">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    'relative text-sm tracking-wide transition-colors duration-300 py-1',
                    useLightText
                      ? active
                        ? 'text-white'
                        : 'text-white/75 hover:text-white'
                      : active
                      ? 'text-primary font-medium'
                      : 'text-foreground/70 hover:text-primary',
                  )}
                  data-testid={`link-nav-${item.label.toLowerCase()}`}
                  aria-current={active ? 'page' : undefined}
                >
                  {item.label}
                  {/* Active underline */}
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      className={cn(
                        'absolute bottom-0 left-0 right-0 h-px',
                        useLightText ? 'bg-white/70' : 'bg-primary',
                      )}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Logo */}
          <div className="w-1/3 flex justify-center">
            <Link
              href="/"
              className={cn(
                'font-serif text-2xl tracking-[0.2em] font-medium transition-colors duration-300',
                useLightText ? 'text-white' : 'text-primary',
              )}
              data-testid="link-home"
            >
              MAISON NOIR
            </Link>
          </div>

          {/* Action icons */}
          <div className="flex items-center justify-end gap-5 sm:gap-6 w-1/3">
            <button
              className={cn('hidden sm:block', iconCls)}
              onClick={() => setSearchOpen(true)}
              data-testid="btn-search"
              aria-label="Search"
            >
              <Search className="w-5 h-5 stroke-[1.5]" />
            </button>
            <Link href={user ? '/account' : '/login'} className="hidden sm:block">
              <button className={iconCls} data-testid="btn-account" aria-label="Account">
                <User className="w-5 h-5 stroke-[1.5]" />
              </button>
            </Link>

            {/* Wishlist */}
            <Link href="/wishlist" className="hidden sm:block">
              <button className={cn('relative', iconCls)} data-testid="btn-wishlist-nav" aria-label="Wishlist">
                <Heart className="w-5 h-5 stroke-[1.5]" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-accent text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-medium">
                    {wishlistCount > 9 ? '9+' : wishlistCount}
                  </span>
                )}
              </button>
            </Link>

            {/* Cart */}
            <button
              className={cn('relative', iconCls)}
              onClick={openCart}
              data-testid="btn-cart"
              aria-label="Open shopping bag"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-medium">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[60] bg-white flex flex-col"
          >
            <div className="flex justify-between items-center p-6 border-b border-border">
              <span className="font-serif text-xl tracking-[0.2em]">MAISON NOIR</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 -mr-2"
                data-testid="btn-close-menu"
                aria-label="Close navigation"
              >
                <X className="w-6 h-6 stroke-[1.5]" />
              </button>
            </div>

            <nav className="flex-1 flex flex-col justify-center gap-1 px-8">
              {NAV_ITEMS.map((item, i) => {
                const active = isActive(item.href);
                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        'font-serif text-4xl transition-colors py-3 block',
                        active ? 'text-accent' : 'text-primary hover:text-accent',
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                      aria-current={active ? 'page' : undefined}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            <div className="px-8 py-8 flex gap-8 border-t border-border">
              <button
                onClick={() => { setMobileMenuOpen(false); setSearchOpen(true); }}
                className="hover:text-accent transition-colors"
                aria-label="Search"
              >
                <Search className="w-6 h-6 stroke-[1.5]" />
              </button>
              <Link href={user ? '/account' : '/login'} onClick={() => setMobileMenuOpen(false)}>
                <button className="hover:text-accent transition-colors" aria-label="Account">
                  <User className="w-6 h-6 stroke-[1.5]" />
                </button>
              </Link>
              <Link href="/wishlist" onClick={() => setMobileMenuOpen(false)}>
                <button className="relative hover:text-accent transition-colors" aria-label="Wishlist">
                  <Heart className="w-6 h-6 stroke-[1.5]" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-accent text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full">
                      {wishlistCount}
                    </span>
                  )}
                </button>
              </Link>
              <button
                onClick={() => { setMobileMenuOpen(false); openCart(); }}
                className="relative hover:text-accent transition-colors"
                aria-label="Open bag"
              >
                <ShoppingBag className="w-6 h-6 stroke-[1.5]" />
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartDrawer />
    </>
  );
}
