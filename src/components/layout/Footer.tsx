import { Link } from 'wouter';
import { Mail } from 'lucide-react';
import { SiInstagram, SiPinterest } from 'react-icons/si';

export function Footer() {
  return (
    <footer className="bg-[#111111] text-white pt-24 pb-8">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 lg:gap-8 mb-24">

          {/* Brand */}
          <div className="col-span-1 sm:col-span-2 md:col-span-1">
            <h2 className="font-serif text-2xl tracking-[0.2em] mb-6">MAISON NOIR</h2>
            <p className="text-white/50 text-sm max-w-xs font-light leading-relaxed">
              Parisian-born quiet luxury house for women who dress with intention.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="font-serif text-lg mb-6">Explore</h3>
            <ul className="space-y-3.5 text-sm text-white/70 font-light">
              <li>
                <Link href="/collections/noir-essentials" className="hover:text-accent transition-colors">
                  Noir Essentials
                </Link>
              </li>
              <li>
                <Link href="/collections/the-ivory-edit" className="hover:text-accent transition-colors">
                  The Ivory Edit
                </Link>
              </li>
              <li>
                <Link href="/collections/soiree-noire" className="hover:text-accent transition-colors">
                  Soirée Noire
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-accent transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/lookbook" className="hover:text-accent transition-colors">
                  Lookbook
                </Link>
              </li>
              <li>
                <Link href="/stories" className="hover:text-accent transition-colors">
                  The Journal
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-serif text-lg mb-6">Company</h3>
            <ul className="space-y-3.5 text-sm text-white/70 font-light">
              <li>
                <Link href="/about" className="hover:text-accent transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/about#craftsmanship" className="hover:text-accent transition-colors">
                  Craftsmanship
                </Link>
              </li>
              <li>
                <Link href="/about#sustainability" className="hover:text-accent transition-colors">
                  Sustainability
                </Link>
              </li>
              <li>
                <Link href="/about#contact" className="hover:text-accent transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Follow */}
          <div>
            <h3 className="font-serif text-lg mb-6">Support</h3>
            <ul className="space-y-3.5 text-sm text-white/70 font-light mb-10">
              <li>
                <Link href="/about#contact" className="hover:text-accent transition-colors">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link href="/about#contact" className="hover:text-accent transition-colors">
                  Garment Care
                </Link>
              </li>
              <li>
                <Link href="/about#contact" className="hover:text-accent transition-colors">
                  Size Guide
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-accent transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>

            <h3 className="font-serif text-lg mb-5">Follow</h3>
            <div className="flex gap-5">
              <span aria-label="Instagram (coming soon)" title="Coming soon" className="text-white/30 cursor-default">
                <SiInstagram className="w-5 h-5" />
              </span>
              <span aria-label="Pinterest (coming soon)" title="Coming soon" className="text-white/30 cursor-default">
                <SiPinterest className="w-5 h-5" />
              </span>
              <a href="mailto:hello@maisonnoir.com" aria-label="Email" className="text-white/60 hover:text-accent transition-colors">
                <Mail className="w-5 h-5 stroke-[1.5]" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/35 font-light tracking-wide">
          <p>© 2025 Maison Noir. All rights reserved.</p>
          <div className="flex gap-6">
            <span>Paris</span>
            <span>London</span>
            <span>New York</span>
            <span>Tokyo</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
