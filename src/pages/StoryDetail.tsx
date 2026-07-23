import { useMemo } from 'react';
import { Link, useParams } from 'wouter';
import { motion } from 'framer-motion';
import { ChevronRight, Clock, ArrowLeft, ArrowRight } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { STORIES } from '@/lib/constants';
import { Story } from '@/types';
import { cn } from '@/lib/utils';

function CategoryPill({ category }: { category: Story['category'] }) {
  return (
    <span className="text-[10px] tracking-[0.18em] uppercase font-medium text-primary border border-primary/25 bg-primary/5 px-2.5 py-1.5 inline-block">
      {category}
    </span>
  );
}

export default function StoryDetail() {
  const params = useParams<{ slug: string }>();

  const story = useMemo(() => STORIES.find((s) => s.slug === params.slug), [params.slug]);

  const related = useMemo(() => {
    if (!story) return [];
    return STORIES.filter(
      (s) => s.id !== story.id && (s.category === story.category || s.featured),
    ).slice(0, 3);
  }, [story]);

  if (!story) {
    return (
      <div className="min-h-[100dvh] flex flex-col bg-[#F7F6F4]">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-32">
          <h1 className="font-serif text-5xl text-primary mb-4">Story Not Found</h1>
          <p className="text-muted-foreground font-light mb-8">
            This essay may have been archived or moved.
          </p>
          <Link href="/stories">
            <button className="px-8 py-3 bg-primary text-white text-xs tracking-widest uppercase">
              Return to the Journal
            </button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] flex flex-col bg-[#F7F6F4]">
      <Navbar />

      <main className="flex-1">
        {/* Hero image */}
        <div className="relative w-full aspect-[16/9] min-h-[420px] overflow-hidden bg-[#111]">
          <motion.img
            src={story.imageUrl}
            alt={story.title}
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 pointer-events-none" />

          {/* Breadcrumb on image */}
          <div className="absolute top-28 left-0 right-0 px-6 lg:px-12 container mx-auto">
            <nav
              className="flex items-center gap-2 text-xs text-white/60 tracking-[0.1em] uppercase"
              aria-label="Breadcrumb"
            >
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3 h-3" />
              <Link href="/stories" className="hover:text-white transition-colors">
                Journal
              </Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-white/80 truncate max-w-[200px]">{story.title}</span>
            </nav>
          </div>

          {/* Title on image */}
          <div className="absolute bottom-0 left-0 right-0 px-6 lg:px-12 pb-12 container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <CategoryPill category={story.category} />
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white leading-tight tracking-tight mt-4 max-w-3xl"
                style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}
              >
                {story.title}
              </h1>
            </motion.div>
          </div>
        </div>

        {/* Article */}
        <article className="container mx-auto px-6 lg:px-12 py-16">
          {/* Article meta */}
          <div className="max-w-2xl mx-auto mb-12 pb-8 border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="font-serif text-xl text-primary/70 italic leading-relaxed">
                {story.subtitle}
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground font-light flex-shrink-0">
              <span>{story.date}</span>
              <span className="w-px h-3 bg-border" />
              <span className="flex items-center gap-1.5">
                <Clock className="w-3 h-3" />
                {story.readingTime} min read
              </span>
            </div>
          </div>

          {/* Body text */}
          <div className="max-w-2xl mx-auto space-y-7">
            {story.content.map((paragraph, i) => (
              <div key={i}>
                {/* Mid-article pull quote */}
                {story.pullQuote && i === Math.floor(story.content.length / 2) && (
                  <motion.blockquote
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="border-l-4 border-accent pl-6 my-10"
                  >
                    <p className="font-serif text-xl sm:text-2xl text-primary/80 italic leading-relaxed">
                      {story.pullQuote}
                    </p>
                  </motion.blockquote>
                )}
                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  className="text-base text-foreground/75 font-light leading-[1.9]"
                >
                  {paragraph}
                </motion.p>
              </div>
            ))}
          </div>

          {/* Author line */}
          <div className="max-w-2xl mx-auto mt-14 pt-8 border-t border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-px bg-accent" />
              <span className="text-xs tracking-[0.15em] uppercase text-muted-foreground font-medium">
                {story.author}
              </span>
            </div>
            <Link
              href="/stories"
              className="flex items-center gap-2 text-xs tracking-[0.15em] uppercase font-semibold text-primary hover:text-accent transition-colors group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform duration-300" />
              Back to Journal
            </Link>
          </div>
        </article>

        {/* Related stories */}
        {related.length > 0 && (
          <section className="border-t border-border py-20 px-6 lg:px-12 container mx-auto">
            <div className="flex items-center justify-between mb-12">
              <h2 className="font-serif text-3xl text-primary">Further Reading</h2>
              <Link
                href="/stories"
                className="hidden sm:flex items-center gap-2 text-xs tracking-[0.15em] uppercase font-semibold text-primary hover:text-accent transition-colors group"
              >
                All Stories
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {related.map((s) => (
                <Link key={s.id} href={`/stories/${s.slug}`} className="group block">
                  <div className="aspect-[4/3] overflow-hidden bg-[#F5F4F2] mb-4">
                    <motion.img
                      src={s.imageUrl}
                      alt={s.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                      loading="lazy"
                    />
                  </div>
                  <p className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground font-medium mb-2">
                    {s.category}
                  </p>
                  <h3 className="font-serif text-xl text-primary group-hover:text-accent transition-colors duration-300 leading-tight">
                    {s.title}
                  </h3>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
