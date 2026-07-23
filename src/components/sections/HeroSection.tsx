import { useRef, useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { Link } from 'wouter';

/* ─── animation variants ──────────────────────────────────────────────── */
const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18, delayChildren: 0.5 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] },
  },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 1.2, ease: 'easeOut' },
  },
};

/* ─── component ───────────────────────────────────────────────────────── */
export function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [videoError, setVideoError] = useState(false);

  return (
    <section
      aria-label="Hero"
      className="relative w-full h-[100dvh] min-h-[600px] overflow-hidden bg-[#0e0e0e]"
    >
      {/* ── Fallback image ─────────────────────────────────────────── */}
      <img
        src="/hero-1.jpg"
        alt=""
        aria-hidden="true"
        className={[
          'absolute inset-0 w-full h-full object-cover object-center select-none',
          'transition-opacity duration-1000',
          videoReady && !videoError ? 'opacity-0' : 'opacity-100',
        ].join(' ')}
      />

      {/* ── Video ──────────────────────────────────────────────────── */}
      {!videoError && (
        <motion.video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onCanPlay={() => setVideoReady(true)}
          onError={() => setVideoError(true)}
          /* gentle scale-in on mount */
          initial={{ scale: 1.08 }}
          animate={{ scale: videoReady ? 1 : 1.08 }}
          transition={{ duration: 8, ease: [0.22, 1, 0.36, 1] }}
          className={[
            'absolute inset-0 w-full h-full object-cover object-center select-none',
            'transition-opacity duration-1000',
            videoReady ? 'opacity-100' : 'opacity-0',
          ].join(' ')}
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
          <source src="/videos/hero.mp4" type="video/quicktime" />
        </motion.video>
      )}

      {/* ── Layer 1 — base dark tint (45 %) ────────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-black/45 pointer-events-none"
      />

      {/* ── Layer 2 — directional gradient (top + bottom boost) ─────── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom,' +
            '  rgba(0,0,0,0.55) 0%,' +
            '  rgba(0,0,0,0.10) 28%,' +
            '  rgba(0,0,0,0.10) 55%,' +
            '  rgba(0,0,0,0.65) 100%)',
        }}
      />

      {/* ── Layer 3 — edge vignette ──────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 90% 90% at 50% 50%,' +
            '  transparent 55%,' +
            '  rgba(0,0,0,0.40) 100%)',
        }}
      />

      {/* ── Content ─────────────────────────────────────────────────── */}
      <div className="absolute inset-0 z-10 flex items-end">
        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 pb-16 sm:pb-20 lg:pb-24">
          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className="max-w-[42rem]"
          >
            {/* Eyebrow */}
            <motion.p
              variants={fadeUp}
              className="text-white/60 text-[11px] uppercase tracking-[0.22em] font-medium mb-6"
            >
              Autumn / Winter 2025
            </motion.p>

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              className={[
                'font-serif text-white leading-[0.88] tracking-tight',
                'text-[clamp(3.8rem,7.5vw,9rem)]',
              ].join(' ')}
              style={{
                textShadow:
                  '0 2px 24px rgba(0,0,0,0.55), 0 1px 4px rgba(0,0,0,0.40)',
              }}
            >
              The<br />New Season
            </motion.h1>

            {/* Body */}
            <motion.p
              variants={fadeUp}
              className="mt-7 sm:mt-8 text-white/88 font-light tracking-wide text-base sm:text-[1.05rem] leading-[1.75] max-w-[30rem]"
              style={{
                textShadow: '0 1px 8px rgba(0,0,0,0.55)',
                color: 'rgba(255,255,255,0.88)',
              }}
            >
              Architectural shapes, soft wools, and intentional restraint.
              A collection designed for the art of living.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={fadeUp}
              className="mt-9 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4"
            >
              {/* Primary — solid white, high contrast */}
              <Link
                href="/shop"
                className={[
                  'inline-flex items-center justify-center',
                  'px-8 py-[14px] min-w-[180px]',
                  'bg-white text-[#111111]',
                  'text-[11px] tracking-[0.18em] uppercase font-medium',
                  'transition-all duration-300',
                  'hover:bg-[#f0ebe4] hover:shadow-lg hover:-translate-y-[1px]',
                  'active:translate-y-0',
                ].join(' ')}
                data-testid="btn-explore-collection"
              >
                Explore Collection
              </Link>

              {/* Secondary — semi-transparent dark, light border */}
              <Link
                href="/lookbook"
                className={[
                  'inline-flex items-center justify-center',
                  'px-8 py-[14px] min-w-[180px]',
                  'bg-black/35 backdrop-blur-[6px]',
                  'border border-white/45 text-white',
                  'text-[11px] tracking-[0.18em] uppercase font-medium',
                  'transition-all duration-300',
                  'hover:bg-black/55 hover:border-white/65 hover:-translate-y-[1px]',
                  'active:translate-y-0',
                ].join(' ')}
                data-testid="btn-view-lookbook"
              >
                View Lookbook
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ── Scroll indicator ────────────────────────────────────────── */}
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        transition={{ delay: 2.2 }}
        className="absolute bottom-8 right-8 sm:right-12 lg:right-16 z-10 flex flex-col items-center gap-[10px]"
      >
        <span className="text-[9px] uppercase tracking-[0.22em] text-white/45 font-medium">
          Scroll
        </span>
        <div className="w-[1px] h-14 bg-white/15 relative overflow-hidden rounded-full">
          <motion.div
            className="absolute left-0 w-full rounded-full bg-white/55"
            style={{ height: '40%' }}
            animate={{ top: ['-40%', '140%'] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut', repeatDelay: 0.3 }}
          />
        </div>
      </motion.div>
    </section>
  );
}
