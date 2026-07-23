import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';

const ADMIN_NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Orders', href: '/admin/orders' },
  { label: 'Products', href: '/admin/products' },
  { label: 'Team', href: '/admin/team' },
];

export function AdminNav() {
  const [location] = useLocation();

  const isActive = (href: string) =>
    href === '/admin' ? location === '/admin' : location.startsWith(href);

  return (
    <div className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-border">
      <div className="container mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <span className="font-serif text-lg">Maison Noir — Admin</span>
          <nav className="hidden md:flex items-center gap-6">
            {ADMIN_NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-xs tracking-[0.1em] uppercase transition-colors',
                  isActive(item.href) ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <Link href="/" className="text-xs tracking-[0.1em] uppercase text-muted-foreground hover:text-primary transition-colors">
          ← Back to Site
        </Link>
      </div>
    </div>
  );
}
