import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { ChevronRight, ArrowRight, Clock } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { STORIES } from '@/lib/constants';
import { Story } from '@/types';
import { AnimatedSection } from '@/components/ui/custom/AnimatedSection';
import { cn } from '@/lib/utils';

// ── Category pill ─────────────────────────────────────────────────────────
function CategoryPill({ category, small }: { category: Story['category']; small?: boolean }) {
  return (
    <span
      className={cn(
        'inline-block tracking-[0.18em] uppercase font-medium text-primary border border-primary/25 bg-primary/5',
        small ? 'text-[9px] px-2 py-1' : 'text-[10px] px-2.5 py-1.5',
      )}
    >
      {category}
    </span>
  );
}

// ── Featured story card ──────────────────────────────────────────────────
function FeaturedCard({ story }: { story: Story }) {
  return (
    <Link href={`/stories/${story.slug}`} className="group block">
      <div className="flex flex-col lg:flex-row gap-0 overflow-hidden bg-white border border-border hover:border-primary/20 transition-colors duration-500">
        {/* Image */}
        <div className="relative w-full lg:w-[55%] aspect-[4/5] sm:aspect-[16/10] lg:aspect-auto overflow-hidden">
          <motion.img
            src={story.imageUrl}
            alt={story.title}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10 pointer-events-none" />
        </div>

        {/* Text */}
        <div className="w-full lg:w-[45%] flex flex-col justify-center px-8 sm:px-10 lg:px-14 py-10 lg:py-16">
          <div className="flex items-center gap-3 mb-6">
            <CategoryPill category={story.category} />
            <span className="text-[10px] tracking-[0.1em] uppercase text-muted-foreground font-light">
              Featured
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.6rem] text-primary leading-tight tracking-tight mb-5 group-hover:text-accent transition-colors duration-300">
            {story.title}
          </h2>
          <p className="text-sm text-foreground/60 font-light leading-relaxed mb-8 max-w-sm">
            {story.excerpt}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-muted-foreground font-light">
              <span>{story.date}</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3 h-3" />
                {story.readingTime} min read
              </span>
            </div>
            <span className="flex items-center gap-2 text-xs tracking-[0.15em] uppercase font-semibold text-primary group-hover:text-accent transition-colors duration-300">
              Read
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ── Story grid card ──────────────────────────────────────────────────────
function StoryCard({ story, index }: { story: Story; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/stories/${story.slug}`} className="group block">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-[#F5F4F2] mb-5">
          <motion.img
            src={story.imageUrl}
            alt={story.title}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            loading="lazy"
          />
        </div>

        {/* Meta */}
        <div className="flex items-center gap-3 mb-3">
          <CategoryPill category={story.category} small />
          <span className="text-[10px] tracking-[0.1em] uppercase text-muted-foreground font-light flex items-center gap-1">
            <Clock className="w-2.5 h-2.5" />
            {story.readingTime} min
          </span>
        </div>

        <h3 className="font-serif text-xl sm:text-2xl text-primary leading-tight tracking-tight mb-3 group-hover:text-accent transition-colors duration-300">
          {story.title}
        </h3>
        <p className="text-sm text-foreground/55 font-light leading-relaxed mb-4 line-clamp-3">
          {story.excerpt}
        </p>
        <p className="text-xs text-muted-foreground font-light">{story.date}</p>
      </Link>
    </motion.article>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────

export default function Stories() {
  const featured = STORIES.find((s) => s.featured) ?? STORIES[0];
  const rest = STORIES.filter((s) => s.id !== featured.id);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-[#F7F6F4]">
      <Navbar />

      <main className="flex-1">
        {/* Header */}
        <section className="pt-32 pb-14 px-6 lg:px-12 container mx-auto">
          <nav
            className="flex items-center gap-2 text-xs text-muted-foreground tracking-[0.1em] uppercase mb-10"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-primary font-medium">Journal</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 max-w-5xl">
            <div>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="text-[11px] tracking-[0.25em] uppercase text-muted-foreground font-medium mb-4"
              >
                Stories &amp; Essays
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
                className="font-serif text-6xl sm:text-7xl text-primary leading-none tracking-tight"
              >
                The Journal
              </motion.h1>
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm text-foreground/55 font-light leading-relaxed max-w-xs"
            >
              On craft, on dressing, on the quiet decisions that shape a life with good taste.
            </motion.p>
          </div>
        </section>

        {/* Featured story */}
        <section className="px-6 lg:px-12 container mx-auto pb-16">
          <AnimatedSection delay={0.1}>
            <FeaturedCard story={featured} />
          </AnimatedSection>
        </section>

        {/* Divider with label */}
        <div className="px-6 lg:px-12 container mx-auto mb-12">
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-medium flex-shrink-0">
              More Stories
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>
        </div>

        {/* Story grid */}
        <section className="px-6 lg:px-12 container mx-auto pb-28">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
            {rest.map((story, i) => (
              <StoryCard key={story.id} story={story} index={i} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
