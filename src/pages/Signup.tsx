import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';

export default function Signup() {
  const { signUpWithEmail, signInWithGoogle } = useAuth();
  const [, navigate] = useLocation();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setIsSubmitting(true);
    const { error } = await signUpWithEmail(email, password, fullName);
    setIsSubmitting(false);
    if (error) {
      setError(error);
      return;
    }
    // Supabase's default config requires email confirmation before a session
    // is created — if that's on, there's no session yet to redirect with.
    // Show a "check your email" state rather than assume immediate login.
    setConfirmationSent(true);
  };

  const handleGoogle = async () => {
    setError(null);
    const { error } = await signInWithGoogle();
    if (error) setError(error);
  };

  if (confirmationSent) {
    return (
      <div className="min-h-[100dvh] flex flex-col pt-24 bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-6 text-center">
          <div className="max-w-sm">
            <h1 className="font-serif text-2xl mb-3">Check your email</h1>
            <p className="text-sm text-muted-foreground font-light">
              We've sent a confirmation link to {email}. Follow it to activate your account.
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] flex flex-col pt-24 bg-background">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="max-w-sm w-full">
          <h1 className="font-serif text-3xl mb-2 text-center">Create Account</h1>
          <p className="text-sm text-muted-foreground font-light text-center mb-10">
            Save your details, track orders, and check out faster.
          </p>

          <button
            type="button"
            onClick={handleGoogle}
            className="w-full py-3 border border-border flex items-center justify-center gap-3 text-sm font-light hover:bg-black/[0.02] transition-colors mb-6"
          >
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
                Full Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full border border-border px-4 py-3 text-sm font-light focus:outline-none focus:border-primary transition-colors"
              />
            </div>
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
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-border px-4 py-3 text-sm font-light focus:outline-none focus:border-primary transition-colors"
              />
              <p className="text-xs text-muted-foreground/70 font-light mt-1.5">At least 8 characters.</p>
            </div>

            {error && <p className="text-sm text-red-600 font-light">{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-primary text-white text-xs tracking-[0.15em] uppercase hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Creating Account…' : 'Create Account'}
            </button>
          </form>

          <p className="text-sm text-muted-foreground font-light text-center mt-8">
            Already have an account?{' '}
            <Link href="/login" className="text-primary underline underline-offset-4 hover:text-accent transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
