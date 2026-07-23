import React from 'react';
import { AnimatedSection } from '@/components/ui/custom/AnimatedSection';
import { ProductCard } from '@/components/ui/custom/ProductCard';
import { NEW_ARRIVALS } from '@/lib/constants';

export function NewArrivals() {
  return (
    <section className="py-24 lg:py-32 bg-white w-full overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12 mb-12 flex justify-between items-end">
        <AnimatedSection>
          <h2 className="font-serif text-3xl lg:text-5xl text-primary">New Arrivals</h2>
        </AnimatedSection>
        <AnimatedSection delay={0.1}>
          <a href="/shop/new" className="text-sm tracking-widest uppercase border-b border-primary pb-1 hover:text-accent hover:border-accent transition-colors">
            View All
          </a>
        </AnimatedSection>
      </div>

      <AnimatedSection delay={0.2} className="pl-6 lg:pl-12">
        <div className="flex gap-6 lg:gap-8 overflow-x-auto pb-12 pr-6 lg:pr-12 snap-x scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
          {NEW_ARRIVALS.map((product) => (
            <div key={product.id} className="min-w-[70vw] md:min-w-[40vw] lg:min-w-[22vw] snap-start">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </AnimatedSection>
    </section>
  );
}
