import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { ChevronRight, Mail, MapPin, ArrowRight } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AnimatedSection } from '@/components/ui/custom/AnimatedSection';

// ── Timeline ──────────────────────────────────────────────────────────────
const TIMELINE = [
  {
    year: '2012',
    title: 'Founded in Paris',
    body: 'Maison Noir is established in the 1st Arrondissement by Isabelle Marchand, with a belief that clothing should outlast the season it was designed for.',
  },
  {
    year: '2015',
    title: 'Rue du Faubourg Saint-Honoré',
    body: 'The first flagship boutique opens. A single room. White walls. No music. The design was meant to disappear behind the pieces.',
  },
  {
    year: '2018',
    title: 'London, Mayfair',
    body: 'The second boutique opens in Mount Street, London. The space is slightly darker than Paris — it suits the city.',
  },
  {
    year: '2020',
    title: 'Two Collections Per Year',
    body: 'The house reduces to two collections annually. The decision is editorial: more time per piece, fewer pieces per season, nothing that cannot justify its existence.',
  },
  {
    year: '2022',
    title: 'Traceability Programme',
    body: 'Full supply chain transparency is introduced. Every garment is accompanied by documentation of its origin, from fibre to finishing.',
  },
  {
    year: '2025',
    title: 'Resort 2025',
    body: "The house's first collection built entirely on deadstock fabrics — a constraint that turned into a creative discipline.",
  },
];

// ── Sustainability pillars ────────────────────────────────────────────────
const PILLARS = [
  {
    number: '01',
    title: 'Made to Last',
    body: 'Every piece is designed with a thirty-year lifespan in mind. We do not make anything we would not still be proud of in a decade.',
  },
  {
    number: '02',
    title: 'Traceable Origin',
    body: 'We know every mill, every farm, every workshop involved in producing a Maison Noir garment. That transparency extends to our customers.',
  },
  {
    number: '03',
    title: 'No Waste Collections',
    body: 'Production is made-to-order where possible. Where it is not, any remaining fabric becomes the starting point for the following season.',
  },
  {
    number: '04',
    title: 'Repair Over Replace',
    body: 'Our ateliers offer a lifetime repair service for any piece bearing our label. A garment returned for repair costs us money. We consider it a point of pride.',
  },
];

// ── Page ─────────────────────────────────────────────────────────────────

export default function About() {
  return (
    <div className="min-h-[100dvh] flex flex-col">
      <Navbar />

      <main className="flex-1">

        {/* ── Hero ─────────────────────────────────────────────────── */}
        <section className="relative w-full aspect-[16/11] min-h-[480px] overflow-hidden bg-[#111]">
          <motion.img
            src="/campaign.jpg"
            alt="Maison Noir atelier"
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/70 pointer-events-none" />

          <div className="absolute inset-0 flex items-end">
            <div className="container mx-auto px-6 lg:px-12 pb-16">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-xs text-white/50 tracking-[0.1em] uppercase mb-10">
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                <ChevronRight className="w-3 h-3" />
                <span className="text-white/80">About</span>
              </nav>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="text-[11px] tracking-[0.25em] uppercase text-white/50 font-medium mb-5"
              >
                Est. Paris, 2012
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="font-serif text-5xl sm:text-6xl lg:text-7xl text-white leading-none tracking-tight max-w-2xl"
                style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}
              >
                Dressed with<br />intention.
              </motion.h1>
            </div>
          </div>
        </section>

        {/* ── Brand Story ──────────────────────────────────────────── */}
        <section className="bg-[#F7F6F4] py-24 lg:py-32 px-6 lg:px-12">
          <div className="container mx-auto max-w-5xl">
            <AnimatedSection>
              <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
                <div className="lg:w-1/3 flex-shrink-0">
                  <p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground font-medium mb-3">
                    Our Story
                  </p>
                  <h2 className="font-serif text-4xl sm:text-5xl text-primary leading-tight tracking-tight">
                    Permanence<br />over novelty.
                  </h2>
                </div>
                <div className="lg:w-2/3 space-y-5">
                  <p className="text-base text-foreground/70 font-light leading-[1.9]">
                    Maison Noir was founded on a single conviction: that the fashion industry had confused activity with progress. More collections, more trends, more product — and somewhere in all of that, the actual quality of the clothing had become secondary.
                  </p>
                  <p className="text-base text-foreground/70 font-light leading-[1.9]">
                    We design two collections a year. Each one takes nine months. We source our fabrics from mills we visit in person — in Biella, in Lyon, in the Alentejo. We work with workshops that have been making the same things, in the same way, for generations.
                  </p>
                  <p className="text-base text-foreground/70 font-light leading-[1.9]">
                    The result is a house that moves slowly and builds carefully. Our customers are not chasing trends. They are building wardrobes — one very considered piece at a time. We believe that is the most interesting kind of dressing there is.
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* ── Craftsmanship ────────────────────────────────────────── */}
        <section id="craftsmanship" className="bg-white py-24 lg:py-32 px-6 lg:px-12 scroll-mt-24">
          <div className="container mx-auto max-w-6xl">
            <AnimatedSection>
              <div className="flex flex-col lg:flex-row gap-0 overflow-hidden">
                {/* Image */}
                <div className="w-full lg:w-1/2 aspect-[4/5] lg:aspect-auto overflow-hidden bg-[#111]">
                  <motion.img
                    src="/product-1.jpg"
                    alt="Craftsmanship — The Tailored Blazer"
                    className="w-full h-full object-cover"
                    whileInView={{ scale: 1 }}
                    initial={{ scale: 1.05 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>

                {/* Text */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-12 lg:px-16 py-14 lg:py-20 bg-[#F7F6F4]">
                  <p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground font-medium mb-5">
                    Craftsmanship
                  </p>
                  <h2 className="font-serif text-4xl sm:text-5xl text-primary leading-tight tracking-tight mb-8">
                    Built to be<br />kept.
                  </h2>
                  <div className="space-y-5 mb-10">
                    <p className="text-sm text-foreground/65 font-light leading-[1.9]">
                      Every piece we make is a construction problem. We begin not with a sketch but with a question: what is the most resolved version of this garment that has ever existed? Then we try to make it.
                    </p>
                    <p className="text-sm text-foreground/65 font-light leading-[1.9]">
                      Our blazers are half-canvassed by hand. Our silks are washed before cutting so they shrink on the bolt, not on the body. Our wools are from mills that have been doing this work for five generations, and we visit them once a year to be reminded of why it matters.
                    </p>
                    <p className="text-sm text-foreground/65 font-light leading-[1.9]">
                      None of this is unusual for a house of our age. What is unusual is that we refuse to compromise any of it in service of a lower price point. That is a choice we make deliberately, every season.
                    </p>
                  </div>
                  <Link href="/stories/the-architecture-of-a-blazer" className="inline-flex items-center gap-2 group w-fit">
                    <span className="text-xs tracking-[0.15em] uppercase font-semibold text-primary border-b border-primary pb-0.5 group-hover:text-accent group-hover:border-accent transition-colors">
                      Read: The Architecture of a Blazer
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-primary group-hover:text-accent group-hover:translate-x-1 transition-all" />
                  </Link>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* ── Sustainability ───────────────────────────────────────── */}
        <section id="sustainability" className="bg-[#F7F6F4] py-24 lg:py-32 px-6 lg:px-12 scroll-mt-24">
          <div className="container mx-auto max-w-5xl">
            <AnimatedSection>
              <div className="text-center mb-16">
                <p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground font-medium mb-4">
                  Sustainability
                </p>
                <h2 className="font-serif text-4xl sm:text-5xl text-primary leading-tight tracking-tight max-w-xl mx-auto">
                  Responsible by construction,<br />
                  <span className="italic font-light">not by declaration.</span>
                </h2>
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border border border-border">
              {PILLARS.map((pillar, i) => (
                <AnimatedSection key={pillar.number} delay={i * 0.08}>
                  <div className="bg-[#F7F6F4] p-8 sm:p-10 lg:p-12">
                    <p className="font-serif text-5xl text-primary/10 mb-4 leading-none">{pillar.number}</p>
                    <h3 className="font-serif text-2xl text-primary mb-4 leading-tight">{pillar.title}</h3>
                    <p className="text-sm text-foreground/60 font-light leading-[1.8]">{pillar.body}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* ── Timeline ─────────────────────────────────────────────── */}
        <section className="bg-[#111111] py-24 lg:py-32 px-6 lg:px-12">
          <div className="container mx-auto max-w-3xl">
            <AnimatedSection>
              <p className="text-[10px] tracking-[0.25em] uppercase text-white/40 font-medium mb-4">
                History
              </p>
              <h2 className="font-serif text-4xl sm:text-5xl text-white leading-tight tracking-tight mb-16">
                Thirteen years, built deliberately.
              </h2>
            </AnimatedSection>

            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-[88px] top-2 bottom-2 w-px bg-white/10 hidden sm:block" />

              <div className="space-y-10">
                {TIMELINE.map((item, i) => (
                  <AnimatedSection key={item.year} delay={i * 0.07}>
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 group">
                      <div className="sm:w-[88px] flex-shrink-0 relative flex sm:justify-end items-start pt-1">
                        <span className="font-serif text-2xl text-white/30 group-hover:text-accent transition-colors duration-300">
                          {item.year}
                        </span>
                        {/* Dot on the line */}
                        <span className="hidden sm:block absolute right-[-5px] top-[10px] w-2.5 h-2.5 rounded-full bg-white/20 group-hover:bg-accent transition-colors duration-300" />
                      </div>
                      <div className="sm:pl-10">
                        <h3 className="font-serif text-xl text-white leading-tight mb-2">{item.title}</h3>
                        <p className="text-sm text-white/50 font-light leading-relaxed">{item.body}</p>
                      </div>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Contact ──────────────────────────────────────────────── */}
        <section id="contact" className="bg-[#F7F6F4] py-24 lg:py-32 px-6 lg:px-12 scroll-mt-24">
          <div className="container mx-auto max-w-5xl">
            <AnimatedSection>
              <div className="text-center mb-16">
                <p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground font-medium mb-4">
                  Get in Touch
                </p>
                <h2 className="font-serif text-4xl sm:text-5xl text-primary leading-tight tracking-tight">
                  We are always<br />
                  <span className="italic font-light">available.</span>
                </h2>
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-16">
              {[
                {
                  icon: <MapPin className="w-5 h-5 stroke-[1.5]" />,
                  title: 'Paris Flagship',
                  lines: ['24 Rue du Faubourg Saint-Honoré', '75008 Paris, France', 'Mon–Sat, 10:00–19:00'],
                },
                {
                  icon: <Mail className="w-5 h-5 stroke-[1.5]" />,
                  title: 'Client Services',
                  lines: ['hello@maisonnoir.com', 'Orders & shipping enquiries', 'Mon–Fri, 09:00–18:00 CET'],
                },
                {
                  icon: <Mail className="w-5 h-5 stroke-[1.5]" />,
                  title: 'Press',
                  lines: ['press@maisonnoir.com', 'Image requests & interviews', 'Editorial collaborations'],
                },
              ].map((card) => (
                <AnimatedSection key={card.title} delay={0.08}>
                  <div className="bg-white border border-border p-8 flex flex-col gap-5">
                    <div className="text-accent">{card.icon}</div>
                    <div>
                      <h3 className="font-serif text-xl text-primary mb-4">{card.title}</h3>
                      <div className="space-y-1.5">
                        {card.lines.map((line, i) => (
                          <p key={i} className="text-sm text-foreground/60 font-light">
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>

            {/* Shop CTA */}
            <AnimatedSection>
              <div className="text-center border-t border-border pt-16">
                <p className="text-sm text-foreground/50 font-light mb-6 max-w-md mx-auto leading-relaxed">
                  Not sure what you're looking for? Our pieces speak for themselves.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/shop">
                    <button className="px-10 py-4 bg-primary text-white text-xs tracking-[0.2em] uppercase font-semibold hover:bg-primary/90 transition-colors duration-300">
                      Browse the Edit
                    </button>
                  </Link>
                  <Link href="/stories">
                    <button className="px-10 py-4 border border-primary text-primary text-xs tracking-[0.2em] uppercase font-semibold hover:bg-primary hover:text-white transition-colors duration-300">
                      Read the Journal
                    </button>
                  </Link>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
