import { getSupabaseAdmin } from '../_lib/supabaseAdmin';

export default {
  async fetch(request: Request) {
    if (request.method !== 'GET') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }

    const authHeader = request.headers.get('authorization');
    const accessToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!accessToken) {
      return Response.json({ error: 'Sign in required.' }, { status: 401 });
    }

    const supabase = getSupabaseAdmin();

    const {
      data: { user: caller },
      error: authError,
    } = await supabase.auth.getUser(accessToken);

    if (authError || !caller) {
      return Response.json({ error: 'Sign in required.' }, { status: 401 });
    }

    // Same admin-only gate as set-admin.ts — checked server-side, not
    // trusted from the client.
    const { data: callerProfile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', caller.id)
      .single();

    if (!callerProfile?.is_admin) {
      return Response.json({ error: 'Admin access required.' }, { status: 403 });
    }

    const { data: adminProfiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, display_name')
      .eq('is_admin', true);

    if (profilesError) {
      console.error('list-admins: failed to load profiles', profilesError);
      return Response.json({ error: 'Failed to load admins.' }, { status: 500 });
    }

    // profiles doesn't store email (it lives on auth.users, which isn't
    // exposed to the client per Supabase's own guidance) — cross-reference
    // via the admin listUsers() API, same primitive set-admin.ts already
    // uses for invites/lookups.
    const { data: usersPage, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) {
      console.error('list-admins: failed to list users', listError);
      return Response.json({ error: 'Failed to load admin emails.' }, { status: 500 });
    }

    const emailById = new Map(usersPage.users.map((u) => [u.id, u.email ?? '']));

    const admins = (adminProfiles ?? []).map((p) => ({
      id: p.id,
      displayName: p.display_name,
      email: emailById.get(p.id) ?? '',
    }));

    return Response.json({ admins });
  },
};
