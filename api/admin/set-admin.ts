import { getSupabaseAdmin } from '../_lib/supabaseAdmin';

interface SetAdminRequestBody {
  targetEmail: string;
  isAdmin: boolean;
}

export default {
  async fetch(request: Request) {
    if (request.method !== 'POST') {
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

    // Confirm the CALLER is already an admin. Server-side, with the
    // service-role client — never trust a client-sent "I am an admin" claim.
    const { data: callerProfile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', caller.id)
      .single();

    if (!callerProfile?.is_admin) {
      return Response.json({ error: 'Admin access required.' }, { status: 403 });
    }

    let body: SetAdminRequestBody;
    try {
      body = await request.json();
    } catch {
      return Response.json({ error: 'Request body must be valid JSON.' }, { status: 400 });
    }

    if (typeof body.targetEmail !== 'string' || typeof body.isAdmin !== 'boolean') {
      return Response.json({ error: 'targetEmail (string) and isAdmin (boolean) are required.' }, { status: 400 });
    }

    const normalizedEmail = body.targetEmail.trim().toLowerCase();

    // Look up the target by email. listUsers() is paginated (1000/page by
    // default) — fine at this store's scale, but would need a real search
    // if the user base grows large enough for that to matter.
    const { data: usersPage, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) {
      console.error('set-admin: failed to list users', listError);
      return Response.json({ error: 'Failed to look up user.' }, { status: 500 });
    }

    const existingUser = usersPage.users.find((u) => u.email?.toLowerCase() === normalizedEmail);

    if (!existingUser) {
      // No account exists for this email yet.
      if (!body.isAdmin) {
        return Response.json({ error: `No account found for ${body.targetEmail}.` }, { status: 404 });
      }

      // Inviting a brand-new admin: create the account and email them a
      // link to set their own password. Their profile row is created by
      // the handle_new_user trigger (0004_auth_and_accounts.sql) the moment
      // the invited account is created — we then flip is_admin on it.
      const { data: invited, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(normalizedEmail);
      if (inviteError || !invited.user) {
        console.error('set-admin: invite failed', inviteError);
        return Response.json({ error: 'Failed to send invite.' }, { status: 500 });
      }

      const { error: grantError } = await supabase
        .from('profiles')
        .update({ is_admin: true, updated_at: new Date().toISOString() })
        .eq('id', invited.user.id);

      if (grantError) {
        console.error('set-admin: invite succeeded but grant failed', grantError);
        return Response.json(
          { error: 'Invite sent, but granting admin failed — try promoting them once they accept.' },
          { status: 500 }
        );
      }

      return Response.json({ success: true, email: normalizedEmail, isAdmin: true, invited: true });
    }

    // Existing account: promote or demote.
    if (existingUser.id === caller.id && body.isAdmin === false) {
      // Prevent an admin from locking themselves out with nobody else able
      // to grant it back — a real, common footgun in role-management UIs.
      return Response.json({ error: "You can't remove your own admin access." }, { status: 400 });
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ is_admin: body.isAdmin, updated_at: new Date().toISOString() })
      .eq('id', existingUser.id);

    if (updateError) {
      console.error('set-admin: failed to update profile', updateError);
      return Response.json({ error: 'Failed to update admin status.' }, { status: 500 });
    }

    return Response.json({ success: true, email: normalizedEmail, isAdmin: body.isAdmin, invited: false });
  },
};
