"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { requireAuth } from "@/lib/actions/auth";
import type { MemberRole } from "@/lib/types/database.types";

export async function inviteMember(formData: FormData) {
  const { orgId } = await requireAuth();

  const email = formData.get("email") as string;
  const role = formData.get("role") as MemberRole;

  if (!email || !role) {
    return { error: "Email and role are required." };
  }

  if (!["member", "client"].includes(role)) {
    return { error: "Invalid role." };
  }

  const adminClient = createAdminClient();

  // Check if user is already a member of this org
  const { data: existingUser } = await adminClient
    .from("users")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (existingUser) {
    const { data: existingMembership } = await adminClient
      .from("memberships")
      .select("id")
      .eq("org_id", orgId)
      .eq("user_id", existingUser.id)
      .maybeSingle();

    if (existingMembership) {
      return { error: "This person is already a member of your workspace." };
    }
  }

  // Check if there's already a pending invitation for this email
  const { data: existingInvite } = await adminClient
    .from("invitations")
    .select("id")
    .eq("org_id", orgId)
    .eq("email", email)
    .eq("status", "pending")
    .maybeSingle();

  if (existingInvite) {
    return { error: "An invitation has already been sent to this email." };
  }

  // Store the invitation with role
  const { error: inviteRecordError } = await adminClient
    .from("invitations")
    .insert({ org_id: orgId, email, role, status: "pending" });

  if (inviteRecordError) {
    return { error: "Failed to create invitation. Please try again." };
  }

  // Send the invite email via Supabase Auth
  const { error: inviteError } = await adminClient.auth.admin.inviteUserByEmail(
    email,
    {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/invite`,
      data: { org_id: orgId, role },
    }
  );

  if (inviteError) {
    // Clean up the invitation record if email failed
    await adminClient
      .from("invitations")
      .delete()
      .eq("org_id", orgId)
      .eq("email", email);
    return { error: inviteError.message };
  }

  return { error: null };
}

export async function removeMember(userId: string) {
  const { orgId } = await requireAuth();
  const adminClient = createAdminClient();

  const { data: membership } = await adminClient
    .from("memberships")
    .select("role")
    .eq("org_id", orgId)
    .eq("user_id", userId)
    .single();

  if (!membership) return { error: "Member not found." };
  if (membership.role === "owner")
    return { error: "Cannot remove the workspace owner." };

  const { error } = await adminClient
    .from("memberships")
    .delete()
    .eq("org_id", orgId)
    .eq("user_id", userId);

  if (error) return { error: "Failed to remove member. Please try again." };
  return { error: null };
}

export async function updateMemberRole(userId: string, role: MemberRole) {
  const { orgId } = await requireAuth();
  const adminClient = createAdminClient();

  if (!["member", "client"].includes(role)) {
    return { error: "Invalid role." };
  }

  const { data: membership } = await adminClient
    .from("memberships")
    .select("role")
    .eq("org_id", orgId)
    .eq("user_id", userId)
    .single();

  if (membership?.role === "owner") {
    return { error: "Cannot change the owner's role." };
  }

  const { error } = await adminClient
    .from("memberships")
    .update({ role })
    .eq("org_id", orgId)
    .eq("user_id", userId);

  if (error) return { error: "Failed to update role. Please try again." };
  return { error: null };
}

export async function cancelInvitation(invitationId: string) {
  const { orgId } = await requireAuth();
  const adminClient = createAdminClient();

  const { error } = await adminClient
    .from("invitations")
    .update({ status: "expired" })
    .eq("id", invitationId)
    .eq("org_id", orgId);

  if (error) return { error: "Failed to cancel invitation. Please try again." };
  return { error: null };
}
