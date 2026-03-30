import { requireAuth } from "@/lib/actions/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { OrgSettingsForm } from "./org-form";

export default async function SettingsPage() {
  const { user, orgId } = await requireAuth();
  const adminClient = createAdminClient();

  const { data: membership } = await adminClient
    .from("memberships")
    .select("role")
    .eq("org_id", orgId)
    .eq("user_id", user.id)
    .single();

  if (membership?.role !== "owner") redirect("/settings/profile");

  const { data: org } = await adminClient
    .from("organizations")
    .select("*")
    .eq("id", orgId)
    .single();

  if (!org) redirect("/dashboard");

  return <OrgSettingsForm org={org} />;
}
