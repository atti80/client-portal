import { requireAuth } from "@/lib/actions/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { ProfileForm } from "./profile-form";

export default async function ProfileSettingsPage() {
  const { user } = await requireAuth();
  const adminClient = createAdminClient();

  const { data: profile } = await adminClient
    .from("users")
    .select("full_name, email, avatar_url")
    .eq("id", user.id)
    .single();

  return <ProfileForm profile={profile!} />;
}
