import React from 'react';
import { AnimatedSection } from '@/components/ui/custom/AnimatedSection';
import { Link } from 'wouter';

export function BrandStory() {
  return (
    <section className="py-24 lg:py-32 bg-white w-full">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          <AnimatedSection className="order-2 lg:order-1 relative aspect-[4/5] w-full max-w-lg mx-auto">
            <img 
              src="/atelier.jpg" 
              alt="Maison Noir Atelier" 
              className="w-full h-full object-cover"
            />
            <div className="absolute -bottom-8 -right-8 w-2/3 h-2/3 bg-background -z-10" />
          </AnimatedSection>

          <div className="order-1 lg:order-2 flex flex-col justify-center">
            <AnimatedSection>
              <h2 className="font-serif text-4xl lg:text-5xl text-primary leading-tight mb-8">
                Made at the pace of intention.
              </h2>
            </AnimatedSection>
            
            <AnimatedSection delay={0.1}>
              <div className="space-y-6 text-muted-foreground font-light text-lg mb-10 leading-relaxed">
                <p>
                  We believe that true luxury cannot be rushed. It is found in the weight of the fabric, the precision of the cut, and the invisible hours of craftsmanship that shape every piece.
                </p>
                <p>
                  Maison Noir was founded on a singular philosophy: to create garments that transcend seasons. We design for the woman who seeks quiet confidence, honoring the tension between bold architecture and soft sensuality.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <Link 
                href="/about" 
                className="inline-flex items-center gap-2 text-sm uppercase tracking-widest font-medium border-b border-primary pb-1 hover:text-accent hover:border-accent transition-all"
              >
                Read Our Story <span>→</span>
              </Link>
            </AnimatedSection>
          </div>

        </div>
      </div>
    </section>
  );
}
