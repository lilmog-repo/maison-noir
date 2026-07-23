import React from 'react';
import { Link } from 'wouter';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { COLLECTIONS } from '@/lib/constants';
import { AnimatedSection } from '@/components/ui/custom/AnimatedSection';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function Collections() {
  return (
    <div className="min-h-[100dvh] flex flex-col pt-24 bg-background">
      <Navbar />

      <main className="flex-1">
        <section className="container mx-auto px-6 lg:px-12 py-16 md:py-24 text-center max-w-4xl">
          <AnimatedSection>
            <p className="text-sm text-muted-foreground tracking-widest uppercase mb-6">Maison Noir</p>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-wide mb-8 leading-none">
              Our Collections
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed">
              We design in distinct edits, releasing pieces only when they meet our standard of permanence. 
              Explore the stories behind our current seasons.
            </p>
          </AnimatedSection>
        </section>

        <section className="container mx-auto px-6 lg:px-12 pb-24 md:pb-32 space-y-24 md:space-y-40">
          {COLLECTIONS.map((collection, index) => {
            const isEven = index % 2 === 0;
            return (
              <AnimatedSection key={collection.id} delay={0.1}>
                <div className={cn(
                  "flex flex-col md:flex-row gap-8 md:gap-16 lg:gap-24 items-center group",
                  !isEven && "md:flex-row-reverse"
                )}>
                  
                  {/* Image Column */}
                  <div className="w-full md:w-3/5 relative overflow-hidden aspect-[4/5] md:aspect-[3/4]">
                    <Link href={`/collections/${collection.slug}`}>
                      <motion.img
                        src={collection.imageUrl}
                        alt={collection.name}
                        className="w-full h-full object-cover cursor-pointer"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </Link>
                  </div>

                  {/* Text Column */}
                  <div className="w-full md:w-2/5 flex flex-col justify-center">
                    <p className="text-xs text-muted-foreground tracking-[0.2em] uppercase mb-4">{collection.season}</p>
                    <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-6 tracking-wide">
                      <Link href={`/collections/${collection.slug}`} className="hover:text-accent transition-colors">
                        {collection.name}
                      </Link>
                    </h2>
                    <p className="text-muted-foreground font-light leading-relaxed mb-10 text-lg">
                      {collection.description}
                    </p>
                    <Link href={`/collections/${collection.slug}`}>
                      <button className="px-8 py-4 border border-border text-sm tracking-widest uppercase hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 w-fit">
                        Explore Collection
                      </button>
                    </Link>
                  </div>

                </div>
              </AnimatedSection>
            );
          })}
        </section>
        
        <AnimatedSection className="border-t border-border mt-12 py-24 text-center container mx-auto px-6 max-w-3xl">
          <p className="font-serif text-3xl md:text-4xl leading-relaxed text-primary/80 italic">
            "True luxury is found not in excess, but in the perfection of what remains."
          </p>
        </AnimatedSection>
      </main>

      <Footer />
    </div>
  );
}
