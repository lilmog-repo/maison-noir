import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Link } from 'wouter';

function fmt(n: number) {
  return n.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export function CartDrawer() {
  const { isOpen, closeCart, items, removeItem, updateQuantity, totalPrice, totalItems } = useCart();

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
            className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm"
            onClick={closeCart}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 right-0 h-[100dvh] w-full max-w-[460px] z-[80] bg-white shadow-2xl flex flex-col"
            role="dialog"
            aria-label="Shopping bag"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
                <h2 className="font-serif text-xl tracking-wide">
                  Your Bag
                  {totalItems > 0 && (
                    <span className="ml-2 text-sm font-sans font-normal text-muted-foreground">({totalItems})</span>
                  )}
                </h2>
              </div>
              <button
                onClick={closeCart}
                className="p-2 -mr-2 hover:text-accent transition-colors"
                aria-label="Close bag"
              >
                <X className="w-5 h-5 stroke-[1.5]" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto">
              {items.length > 0 ? (
                <ul className="divide-y divide-border">
                  {items.map((item) => {
                    const lineTotal = item.product.price * item.quantity;
                    return (
                      <li
                        key={`${item.product.id}-${item.size}-${item.color.name}`}
                        className="flex gap-4 px-6 py-5"
                      >
                        {/* Thumbnail */}
                        <Link
                          href={`/products/${item.product.slug}`}
                          onClick={closeCart}
                          className="w-20 aspect-[3/4] bg-[#F5F4F2] overflow-hidden flex-shrink-0"
                        >
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          />
                        </Link>

                        {/* Info */}
                        <div className="flex-1 flex flex-col gap-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <Link
                              href={`/products/${item.product.slug}`}
                              onClick={closeCart}
                              className="font-serif text-base leading-tight hover:text-accent transition-colors"
                            >
                              {item.product.name}
                            </Link>
                            <button
                              onClick={() => removeItem(item.product.id, item.size, item.color.name)}
                              className="text-muted-foreground hover:text-primary transition-colors flex-shrink-0 mt-0.5"
                              aria-label="Remove item"
                            >
                              <X className="w-4 h-4 stroke-[1.5]" />
                            </button>
                          </div>

                          {/* Meta */}
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>Size {item.size}</span>
                            <span className="w-px h-3 bg-border" />
                            <div className="flex items-center gap-1.5">
                              <span
                                className="w-3 h-3 rounded-full border border-black/10 flex-shrink-0"
                                style={{ backgroundColor: item.color.hex }}
                              />
                              <span>{item.color.name}</span>
                            </div>
                          </div>

                          {/* Price + qty row */}
                          <div className="flex items-center justify-between mt-2">
                            {/* Quantity stepper */}
                            <div className="flex items-center border border-border">
                              <button
                                onClick={() => updateQuantity(item.product.id, item.size, item.color.name, item.quantity - 1)}
                                className="w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-8 text-center text-sm select-none">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.product.id, item.size, item.color.name, item.quantity + 1)}
                                className="w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            {/* Line total */}
                            <div className="text-right">
                              <p className="text-sm font-medium">€{fmt(lineTotal)}</p>
                              {item.quantity > 1 && (
                                <p className="text-xs text-muted-foreground font-light">€{fmt(item.product.price)} each</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                /* Empty state */
                <div className="h-full flex flex-col items-center justify-center text-center px-8 py-16 gap-5">
                  <div className="w-14 h-14 border border-border/60 rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6 stroke-[1] text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl mb-2">Your bag is empty</h3>
                    <p className="text-muted-foreground font-light text-sm leading-relaxed max-w-[240px] mx-auto">
                      Discover our latest pieces and begin your collection.
                    </p>
                  </div>
                  <Link href="/shop" onClick={closeCart}>
                    <button className="mt-2 px-8 py-3 bg-primary text-white text-xs tracking-[0.15em] uppercase hover:bg-primary/90 transition-colors">
                      Explore Shop
                    </button>
                  </Link>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-border bg-white px-6 py-6 space-y-5">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-light text-muted-foreground uppercase tracking-widest">Subtotal</span>
                  <span className="font-serif text-2xl">€{fmt(totalPrice)}</span>
                </div>
                <p className="text-xs text-muted-foreground font-light text-center -mt-1">
                  Shipping and taxes calculated at checkout
                </p>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="block w-full py-4 bg-primary text-white text-xs tracking-[0.15em] uppercase hover:bg-primary/90 transition-colors text-center"
                  data-testid="btn-checkout"
                >
                  Proceed to Checkout
                </Link>
                <button
                  onClick={closeCart}
                  className="w-full text-xs text-primary underline underline-offset-4 tracking-widest uppercase hover:text-accent transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
