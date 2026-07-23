import { useRef } from 'react';
import { Link } from 'wouter';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { LOOKBOOK_CAMPAIGNS } from '@/lib/constants';
import { AnimatedSection } from '@/components/ui/custom/AnimatedSection';
import { cn } from '@/lib/utils';

// ── Parallax Campaign Block ───────────────────────────────────────────────
function CampaignBlock({
  campaign,
  index,
}: {
  campaign: (typeof LOOKBOOK_CAMPAIGNS)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);
  const isEven = index % 2 === 0;

  return (
    <AnimatedSection delay={0.05}>
      <article
        ref={ref}
        className={cn(
          'flex flex-col gap-0 md:flex-row md:items-stretch',
          !isEven && 'md:flex-row-reverse',
        )}
      >
        {/* Image */}
        <div className="relative w-full md:w-[58%] aspect-[4/5] md:aspect-auto md:min-h-[640px] overflow-hidden bg-[#111]">
          <motion.img
            src={campaign.imageUrl}
            alt={campaign.title}
            style={{ y }}
            className="absolute inset-0 w-[100%] h-[115%] -top-[7.5%] object-cover"
            loading="lazy"
          />
          {/* Season label */}
          <div className="absolute top-6 left-6 z-10">
            <span className="text-[10px] tracking-[0.22em] uppercase text-white/60 font-medium bg-black/30 backdrop-blur-sm px-3 py-1.5">
              {campaign.season}
            </span>
          </div>
        </div>

        {/* Text */}
        <div
          className={cn(
            'w-full md:w-[42%] flex flex-col justify-center px-8 py-14 sm:px-12 md:px-16 lg:px-20 bg-[#F7F6F4]',
          )}
        >
          <p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground font-medium mb-6">
            {`0${index + 1}`} — Campaign
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-primary leading-none tracking-tight mb-8">
            {campaign.title}
          </h2>
          <blockquote className="border-l-2 border-accent pl-5 mb-8">
            <p className="font-serif text-lg sm:text-xl text-primary/70 italic leading-relaxed">
              "{campaign.quote}"
            </p>
          </blockquote>
          <p className="text-sm text-foreground/60 font-light leading-relaxed mb-10 max-w-sm">
            {campaign.description}
          </p>
          <Link
            href={`/collections/${campaign.collectionSlug}`}
            className="inline-flex items-center gap-3 group w-fit"
          >
            <span className="text-xs tracking-[0.18em] uppercase font-semibold text-primary border-b border-primary pb-0.5 group-hover:text-accent group-hover:border-accent transition-colors duration-300">
              Shop the Collection
            </span>
            <ArrowRight className="w-4 h-4 text-primary group-hover:text-accent group-hover:translate-x-1 transition-all duration-300" />
          </Link>
        </div>
      </article>
    </AnimatedSection>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────

export default function Lookbook() {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-[#F7F6F4]">
      <Navbar />

      <main className="flex-1">
        {/* Header */}
        <section className="pt-32 pb-16 px-6 lg:px-12 container mx-auto">
          {/* Breadcrumb */}
          <nav
            className="flex items-center gap-2 text-xs text-muted-foreground tracking-[0.1em] uppercase mb-10"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-primary font-medium">Lookbook</span>
          </nav>

          <div className="max-w-3xl">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="text-[11px] tracking-[0.25em] uppercase text-muted-foreground font-medium mb-5"
            >
              Maison Noir — 2025
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="font-serif text-6xl sm:text-7xl lg:text-8xl text-primary leading-none tracking-tight mb-8"
            >
              The Lookbook
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
              className="text-base text-foreground/55 font-light leading-relaxed max-w-xl"
            >
              Three seasons, three distinct moods. Each campaign is shot in the spirit of the
              collection it represents — without excess, without contrivance.
            </motion.p>
          </div>
        </section>

        {/* Divider */}
        <div className="w-full h-px bg-border" />

        {/* Campaigns */}
        <section className="divide-y divide-border">
          {LOOKBOOK_CAMPAIGNS.map((campaign, i) => (
            <CampaignBlock key={campaign.id} campaign={campaign} index={i} />
          ))}
        </section>

        {/* Footer CTA */}
        <AnimatedSection>
          <section className="py-28 px-6 text-center bg-[#111111]">
            <p className="text-[10px] tracking-[0.25em] uppercase text-white/40 font-medium mb-6">
              The Full Edit
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl text-white leading-tight mb-8 max-w-lg mx-auto">
              Every piece, available now.
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/shop">
                <button className="px-10 py-4 bg-white text-primary text-xs tracking-[0.2em] uppercase font-semibold hover:bg-[#f0ebe4] transition-colors duration-300">
                  Shop All Pieces
                </button>
              </Link>
              <Link href="/collections">
                <button className="px-10 py-4 border border-white/30 text-white text-xs tracking-[0.2em] uppercase font-semibold hover:border-white/60 transition-colors duration-300">
                  View Collections
                </button>
              </Link>
            </div>
          </section>
        </AnimatedSection>
      </main>

      <Footer />
    </div>
  );
}
