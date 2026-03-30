import { requireAuth } from "@/lib/actions/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { SettingsNav } from "./settings-nav";

export default async function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, orgId } = await requireAuth();
  const adminClient = createAdminClient();

  const { data: membership } = await adminClient
    .from("memberships")
    .select("role")
    .eq("org_id", orgId)
    .eq("user_id", user.id)
    .single();

  const isOwner = membership?.role === "owner";

  return (
    <div className="max-w-4xl">
      <h1 className="text-xl font-semibold text-stone-900 mb-6">Settings</h1>
      <div className="flex gap-8">
        <SettingsNav isOwner={isOwner} />
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
