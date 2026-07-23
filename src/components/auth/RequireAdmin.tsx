import { ReactNode, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/context/AuthContext';

export function RequireAdmin({ children }: { children: ReactNode }) {
  const { user, isAdmin, isLoading } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      navigate('/login?next=/admin');
      return;
    }
    if (!isAdmin) {
      navigate('/');
    }
  }, [isLoading, user, isAdmin, navigate]);

  if (isLoading || !user || !isAdmin) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-background">
        <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
