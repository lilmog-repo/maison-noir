import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function NotFound() {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-[#F7F6F4]">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-32">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-lg"
        >
          <p className="text-[11px] tracking-[0.25em] uppercase text-muted-foreground font-medium mb-6">
            Error 404
          </p>
          <h1 className="font-serif text-6xl sm:text-7xl text-primary leading-none tracking-tight mb-6">
            Page Not Found
          </h1>
          <div className="w-12 h-px bg-accent mx-auto mb-8" />
          <p className="text-base text-foreground/60 font-light leading-relaxed mb-12">
            The page you're looking for may have moved or no longer exists.
            Please return to our homepage or continue browsing the edit.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <button className="px-10 py-4 bg-primary text-white text-xs tracking-[0.2em] uppercase font-medium hover:bg-primary/90 transition-colors duration-300">
                Return Home
              </button>
            </Link>
            <Link href="/shop">
              <button className="px-10 py-4 border border-primary text-primary text-xs tracking-[0.2em] uppercase font-medium hover:bg-primary hover:text-white transition-colors duration-300">
                Browse the Edit
              </button>
            </Link>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
