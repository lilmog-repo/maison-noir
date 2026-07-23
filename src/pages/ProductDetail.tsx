import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'wouter';
import { motion } from 'framer-motion';
import { ChevronRight, Heart, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ImageGallery } from '@/components/product/ImageGallery';
import { ProductCard } from '@/components/ui/custom/ProductCard';
import { PRODUCTS, COLLECTIONS } from '@/lib/constants';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function ProductDetail() {
  const params = useParams<{ slug: string }>();
  const { addItem } = useCart();
  const { toggle, isWishlisted } = useWishlist();

  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [activeAccordion, setActiveAccordion] = useState<string | null>('description');

  const product = useMemo(() => {
    return PRODUCTS.find((p) => p.slug === params.slug);
  }, [params.slug]);

  // Reset selections when product changes
  React.useEffect(() => {
    if (product) {
      setSelectedColor(product.colors[0]?.name || '');
      setSelectedSize(''); // Force user to select size
    }
  }, [product]);

  const collection = useMemo(() => {
    return COLLECTIONS.find((c) => c.id === product?.collection);
  }, [product]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return PRODUCTS
      .filter((p) => p.id !== product.id && (p.collection === product.collection || p.category === product.category))
      .slice(0, 4);
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-[100dvh] flex flex-col pt-24">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center text-center p-6">
          <h1 className="font-serif text-4xl mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-8">This piece may have been archived or removed.</p>
          <Link href="/shop">
            <button className="px-8 py-3 bg-primary text-white text-sm tracking-widest uppercase">
              Return to Shop
            </button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }
    const colorObj = product.colors.find((c) => c.name === selectedColor) || product.colors[0];
    addItem(product, selectedSize, colorObj);
    toast.success('Added to bag');
  };

  const wishlisted = isWishlisted(product.id);

  const toggleAccordion = (section: string) => {
    setActiveAccordion((prev) => (prev === section ? null : section));
  };

  return (
    <div className="min-h-[100dvh] flex flex-col pt-24 bg-background">
      <Navbar />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="container mx-auto px-6 lg:px-12 py-6">
          <div className="flex items-center gap-2 text-xs text-muted-foreground tracking-wide uppercase overflow-x-auto whitespace-nowrap scrollbar-none">
            <Link href="/" className="hover:text-primary transition-colors shrink-0">Home</Link>
            <ChevronRight className="w-3 h-3 shrink-0" />
            <Link href={collection ? `/collections/${collection.slug}` : '/shop'} className="hover:text-primary transition-colors shrink-0">
              {collection ? collection.name : 'Shop'}
            </Link>
            <ChevronRight className="w-3 h-3 shrink-0" />
            <span className="text-primary truncate">{product.name}</span>
          </div>
        </div>

        {/* Product Layout */}
        <div className="container mx-auto px-6 lg:px-12 py-8 lg:py-12">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
            
            {/* Left: Image Gallery */}
            <div className="w-full lg:w-3/5">
              <ImageGallery images={product.images} productName={product.name} />
            </div>

            {/* Right: Product Info */}
            <div className="w-full lg:w-2/5 flex flex-col">
              <div className="sticky top-32">
                
                {/* Header */}
                <div className="mb-8">
                  {collection && (
                    <div className="inline-block px-3 py-1 bg-muted/50 border border-border text-xs tracking-wider uppercase mb-6 rounded-full">
                      {collection.name}
                    </div>
                  )}
                  <h1 className="font-serif text-4xl lg:text-5xl mb-4 tracking-wide">{product.name}</h1>
                  
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-xl font-medium tracking-wide">
                      {product.originalPrice && (
                        <span className="text-muted-foreground line-through mr-3 font-light">€{product.originalPrice}</span>
                      )}
                      €{product.price}
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={cn(
                              "w-4 h-4", 
                              i < Math.floor(product.rating) ? "fill-primary text-primary" : "fill-transparent text-border"
                            )} 
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground underline underline-offset-4 cursor-pointer hover:text-primary">
                        {product.reviewCount} Reviews
                      </span>
                    </div>
                  </div>
                </div>

                {/* Selectors */}
                <div className="space-y-8 mb-10">
                  {/* Colors */}
                  {product.colors.length > 0 && (
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-sm font-medium tracking-wide uppercase">Color</span>
                        <span className="text-sm text-muted-foreground">{selectedColor}</span>
                      </div>
                      <div className="flex gap-4">
                        {product.colors.map((color) => (
                          <button
                            key={color.name}
                            onClick={() => setSelectedColor(color.name)}
                            className={cn(
                              "w-10 h-10 rounded-full border-2 p-0.5 transition-all",
                              selectedColor === color.name ? "border-primary" : "border-transparent hover:border-muted-foreground/30"
                            )}
                            title={color.name}
                          >
                            <span 
                              className="block w-full h-full rounded-full border border-black/10"
                              style={{ backgroundColor: color.hex }}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sizes */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm font-medium tracking-wide uppercase">Size</span>
                      <button className="text-sm text-muted-foreground underline underline-offset-4 hover:text-primary transition-colors">
                        Size Guide
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={cn(
                            "px-4 py-2 border text-sm tracking-wide transition-all min-w-[3rem]",
                            selectedSize === size
                              ? "border-primary bg-primary text-white"
                              : "border-border bg-transparent text-foreground hover:border-primary"
                          )}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-4 mb-12">
                  <button
                    onClick={handleAddToCart}
                    className="w-full py-4 bg-primary text-white text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors"
                  >
                    Add to Bag
                  </button>
                  <button
                    onClick={() => toggle(product.id)}
                    className="w-full py-4 border border-border text-sm tracking-widest uppercase flex items-center justify-center gap-3 hover:border-primary transition-colors"
                  >
                    <Heart className={cn("w-4 h-4", wishlisted && "fill-accent text-accent stroke-none")} />
                    {wishlisted ? 'Saved to Wishlist' : 'Save to Wishlist'}
                  </button>
                </div>

                {/* Accordions */}
                <div className="border-t border-border">
                  {[
                    { id: 'description', label: 'Description', content: <p className="text-sm text-muted-foreground leading-relaxed font-light">{product.description}</p> },
                    { id: 'details', label: 'Details & Materials', content: <ul className="list-disc pl-4 space-y-2 text-sm text-muted-foreground font-light">{product.details.map((d, i) => <li key={i}>{d}</li>)}</ul> },
                    { id: 'delivery', label: 'Delivery & Returns', content: <p className="text-sm text-muted-foreground leading-relaxed font-light">Complimentary express shipping on all orders. Returns are accepted within 14 days of delivery for pieces in their original, unworn condition with tags attached.</p> }
                  ].map((section) => (
                    <div key={section.id} className="border-b border-border">
                      <button
                        onClick={() => toggleAccordion(section.id)}
                        className="w-full py-5 flex justify-between items-center hover:text-accent transition-colors"
                      >
                        <span className="text-sm font-medium tracking-wide uppercase">{section.label}</span>
                        {activeAccordion === section.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                      <motion.div
                        initial={false}
                        animate={{ height: activeAccordion === section.id ? 'auto' : 0, opacity: activeAccordion === section.id ? 1 : 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pb-6">
                          {section.content}
                        </div>
                      </motion.div>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="container mx-auto px-6 lg:px-12 py-24 border-t border-border mt-12">
            <h2 className="font-serif text-3xl mb-12 text-center tracking-wide">You May Also Like</h2>
            <div className="flex overflow-x-auto lg:grid lg:grid-cols-4 gap-6 pb-8 scrollbar-none snap-x">
              {relatedProducts.map((p) => (
                <div key={p.id} className="min-w-[280px] w-full shrink-0 snap-start">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
