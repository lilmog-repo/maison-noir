import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { AdminNav } from '@/components/admin/AdminNav';

interface AdminRow {
  id: string;
  display_name: string | null;
  email: string;
}

export default function AdminTeam() {
  const { session, user } = useAuth();
  const [admins, setAdmins] = useState<AdminRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState('');
  const [isInviting, setIsInviting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (session) loadAdmins();
  }, [session]);

  async function loadAdmins() {
    if (!session) return;
    setIsLoading(true);
    const res = await fetch('/api/admin/list-admins', {
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    if (res.ok) {
      const body = await res.json();
      setAdmins(
        (body.admins ?? []).map((a: { id: string; displayName: string | null; email: string }) => ({
          id: a.id,
          display_name: a.displayName,
          email: a.email,
        }))
      );
    }
    setIsLoading(false);
  }

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    if (!session) return;

    setIsInviting(true);
    const res = await fetch('/api/admin/set-admin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ targetEmail: inviteEmail, isAdmin: true }),
    });
    const body = await res.json();
    setIsInviting(false);

    if (!res.ok) {
      setMessage({ type: 'error', text: body.error || 'Failed to invite.' });
      return;
    }

    setMessage({
      type: 'success',
      text: body.invited
        ? `Invite sent to ${inviteEmail}. They'll receive an email to set up their account.`
        : `${inviteEmail} is now an admin.`,
    });
    setInviteEmail('');
    loadAdmins();
  }

  async function handleRevoke(email: string) {
    if (!session) return;
    if (!confirm(`Remove admin access for ${email}?`)) return;

    const res = await fetch('/api/admin/set-admin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ targetEmail: email, isAdmin: false }),
    });
    const body = await res.json();

    if (!res.ok) {
      setMessage({ type: 'error', text: body.error || 'Failed to revoke.' });
      return;
    }
    loadAdmins();
  }

  return (
    <div className="min-h-[100dvh] flex flex-col pt-24 bg-background">
      <AdminNav />
      <div className="flex-1 px-6 lg:px-12 pb-16">
        <div className="container mx-auto max-w-2xl">
          <h1 className="font-serif text-3xl mb-8 mt-4">Team</h1>

          <form onSubmit={handleInvite} className="flex gap-3 mb-8">
            <input
              type="email"
              required
              placeholder="colleague@email.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="flex-1 border border-border px-4 py-3 text-sm font-light focus:outline-none focus:border-primary transition-colors"
            />
            <button
              type="submit"
              disabled={isInviting}
              className="py-3 px-6 bg-primary text-white text-xs tracking-[0.15em] uppercase hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isInviting ? 'Inviting…' : 'Invite Admin'}
            </button>
          </form>

          {message && (
            <p className={`text-sm font-light mb-6 ${message.type === 'error' ? 'text-red-600' : 'text-green-700'}`}>
              {message.text}
            </p>
          )}

          <h2 className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-3">Current Admins</h2>
          {isLoading ? (
            <p className="text-sm text-muted-foreground font-light">Loading…</p>
          ) : (
            <div className="border border-border">
              {admins.map((admin) => (
                <div
                  key={admin.id}
                  className="flex items-center justify-between px-4 py-3 border-b border-border last:border-0 text-sm font-light"
                >
                  <div>
                    <p>{admin.display_name || '—'}</p>
                    <p className="text-xs text-muted-foreground">
                      {admin.email}
                      {admin.id === user?.id && ' (you)'}
                    </p>
                  </div>
                  {admin.id !== user?.id && (
                    <button
                      onClick={() => handleRevoke(admin.email)}
                      className="text-xs text-red-600 underline underline-offset-4 hover:text-red-700"
                    >
                      Revoke
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
