import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';

export default function Login() {
  const { signInWithEmail, signInWithGoogle } = useAuth();
  const [, navigate] = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    const { error } = await signInWithEmail(email, password);
    setIsSubmitting(false);
    if (error) {
      setError(error);
      return;
    }
    navigate('/account');
  };

  const handleGoogle = async () => {
    setError(null);
    const { error } = await signInWithGoogle();
    if (error) setError(error);
    // On success, Supabase redirects the browser away — nothing further to do here.
  };

  return (
    <div className="min-h-[100dvh] flex flex-col pt-24 bg-background">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="max-w-sm w-full">
          <h1 className="font-serif text-3xl mb-2 text-center">Sign In</h1>
          <p className="text-sm text-muted-foreground font-light text-center mb-10">
            An account is required to complete a purchase.
          </p>

          <button
            type="button"
            onClick={handleGoogle}
            className="w-full py-3 border border-border flex items-center justify-center gap-3 text-sm font-light hover:bg-black/[0.02] transition-colors mb-6"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-2">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-border px-4 py-3 text-sm font-light focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-border px-4 py-3 text-sm font-light focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            {error && <p className="text-sm text-red-600 font-light">{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-primary text-white text-xs tracking-[0.15em] uppercase hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Signing In…' : 'Sign In'}
            </button>
          </form>

          <p className="text-sm text-muted-foreground font-light text-center mt-8">
            Don't have an account?{' '}
            <Link href="/signup" className="text-primary underline underline-offset-4 hover:text-accent transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84c-.21 1.13-.84 2.09-1.8 2.73v2.27h2.92c1.7-1.57 2.68-3.88 2.68-6.64z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.81 5.96-2.18l-2.92-2.27c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.71H.96v2.34C2.44 15.98 5.48 18 9 18z" />
      <path fill="#FBBC05" d="M3.97 10.7c-.18-.54-.28-1.11-.28-1.7s.1-1.16.28-1.7V4.96H.96A8.997 8.997 0 000 9c0 1.45.35 2.83.96 4.04l3.01-2.34z" />
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.59-2.59C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.96l3.01 2.34C4.68 5.16 6.66 3.58 9 3.58z" />
    </svg>
  );
}
