import React from 'react';
import { AnimatedSection } from '@/components/ui/custom/AnimatedSection';
import { CollectionCard } from '@/components/ui/custom/CollectionCard';
import { COLLECTIONS } from '@/lib/constants';
import { motion } from 'framer-motion';

export function FeaturedCollections() {
  return (
    <section className="py-24 lg:py-32 bg-background w-full">
      <div className="container mx-auto px-6 lg:px-12">
        <AnimatedSection className="flex flex-col items-center text-center mb-16 lg:mb-24">
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4 font-medium">
            Collections
          </span>
          <h2 className="font-serif text-4xl lg:text-6xl text-primary max-w-2xl leading-tight">
            Dressed for Every Act
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {COLLECTIONS.map((collection, index) => (
            <AnimatedSection key={collection.id} delay={index * 0.1}>
              <CollectionCard collection={collection} />
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
