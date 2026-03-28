import { requireAuth } from "@/lib/actions/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { MembersClient } from "./client";

export default async function MembersPage() {
  const { user, orgId } = await requireAuth();
  const adminClient = createAdminClient();

  const { data: members } = await adminClient
    .from("memberships")
    .select(
      `
      id,
      role,
      joined_at,
      users (
        id,
        email,
        full_name,
        avatar_url
      )
    `
    )
    .eq("org_id", orgId)
    .order("joined_at", { ascending: true });

  const { data: invitations } = await adminClient
    .from("invitations")
    .select("id, email, role, created_at, expires_at")
    .eq("org_id", orgId)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  return (
    <MembersClient
      currentUserId={user.id}
      members={members ?? []}
      invitations={invitations ?? []}
    />
  );
}
