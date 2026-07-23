import React, { useMemo } from 'react';
import { useParams, Link } from 'wouter';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { COLLECTIONS, PRODUCTS } from '@/lib/constants';
import { ProductCard } from '@/components/ui/custom/ProductCard';
import { AnimatedSection } from '@/components/ui/custom/AnimatedSection';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

export default function CollectionDetail() {
  const params = useParams<{ slug: string }>();
  
  const collection = useMemo(() => {
    return COLLECTIONS.find((c) => c.slug === params.slug);
  }, [params.slug]);

  const collectionProducts = useMemo(() => {
    if (!collection) return [];
    return PRODUCTS.filter((p) => p.collection === collection.id);
  }, [collection]);

  const relatedCollections = useMemo(() => {
    if (!collection) return [];
    return COLLECTIONS.filter((c) => c.id !== collection.id).slice(0, 2);
  }, [collection]);

  if (!collection) {
    return (
      <div className="min-h-[100dvh] flex flex-col pt-24">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center text-center p-6">
          <h1 className="font-serif text-4xl mb-4">Collection Not Found</h1>
          <p className="text-muted-foreground mb-8">This collection may have been archived or removed.</p>
          <Link href="/collections">
            <button className="px-8 py-3 bg-primary text-white text-sm tracking-widest uppercase">
              View All Collections
            </button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] flex flex-col pt-24 bg-background">
      <Navbar />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="container mx-auto px-6 lg:px-12 py-6">
          <div className="flex items-center gap-2 text-xs text-muted-foreground tracking-wide uppercase">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/collections" className="hover:text-primary transition-colors">Collections</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-primary">{collection.name}</span>
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative w-full max-w-3xl mx-auto aspect-[4/5] max-h-[75vh] overflow-hidden">
          <motion.img
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            src={collection.imageUrl}
            alt={collection.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
          
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-white max-w-4xl mx-auto">
            <AnimatedSection>
              <p className="text-sm tracking-[0.2em] uppercase mb-4 text-white/80">{collection.season}</p>
              <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-wide mb-6">
                {collection.name}
              </h1>
              <p className="text-lg md:text-xl font-light text-white/90 leading-relaxed max-w-2xl mx-auto">
                {collection.description}
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* Product Grid */}
        <section className="container mx-auto px-6 lg:px-12 py-24">
          <div className="flex justify-between items-end mb-12">
            <h2 className="font-serif text-3xl md:text-4xl tracking-wide">The Edit</h2>
            <p className="text-sm text-muted-foreground hidden sm:block">{collectionProducts.length} Pieces</p>
          </div>

          {collectionProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
              {collectionProducts.map((product, i) => (
                <AnimatedSection key={product.id} delay={i * 0.1}>
                  <ProductCard product={product} />
                </AnimatedSection>
              ))}
            </div>
          ) : (
            <div className="py-24 text-center border border-border">
              <h3 className="font-serif text-2xl mb-2">Coming Soon</h3>
              <p className="text-muted-foreground font-light">Pieces for this collection are not yet available.</p>
            </div>
          )}
        </section>

        {/* Related Collections */}
        {relatedCollections.length > 0 && (
          <section className="container mx-auto px-6 lg:px-12 py-24 border-t border-border bg-muted/30">
            <h2 className="font-serif text-3xl mb-12 text-center">More from Maison Noir</h2>
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
              {relatedCollections.map((rc) => (
                <div key={rc.id} className="group relative cursor-pointer overflow-hidden aspect-[4/5]">
                  <Link href={`/collections/${rc.slug}`}>
                    <div className="absolute inset-0">
                      <motion.img
                        src={rc.imageUrl}
                        alt={rc.name}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                      />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-500" />
                    </div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-6">
                      <p className="text-xs tracking-[0.2em] uppercase mb-3 opacity-80">{rc.season}</p>
                      <h3 className="font-serif text-3xl lg:text-4xl tracking-wide">{rc.name}</h3>
                    </div>
                  </Link>
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
