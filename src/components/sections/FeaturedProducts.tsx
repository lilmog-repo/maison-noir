import React from 'react';
import { AnimatedSection } from '@/components/ui/custom/AnimatedSection';
import { ProductCard } from '@/components/ui/custom/ProductCard';
import { NEW_ARRIVALS } from '@/lib/constants';

export function FeaturedProducts() {
  const mainProduct = NEW_ARRIVALS[0];
  const sideProducts = NEW_ARRIVALS.slice(1, 4);

  return (
    <section className="py-24 lg:py-40 bg-background w-full">
      <div className="container mx-auto px-6 lg:px-12">
        <AnimatedSection className="mb-16">
          <h2 className="font-serif text-3xl lg:text-5xl text-primary">Selected Pieces</h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          {/* Main Hero Product */}
          <div className="lg:col-span-7">
            <AnimatedSection>
              <ProductCard product={mainProduct} large className="max-w-xl mx-auto lg:mx-0" />
            </AnimatedSection>
          </div>

          {/* Side Grid */}
          <div className="lg:col-span-5 flex flex-col justify-center gap-12 lg:gap-16 pt-12 lg:pt-0">
            {sideProducts.map((product, index) => (
              <AnimatedSection key={product.id} delay={0.2 + (index * 0.1)}>
                <ProductCard product={product} className="max-w-sm ml-auto lg:mr-0" />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
