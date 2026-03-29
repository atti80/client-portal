import { requireAuth } from "@/lib/actions/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, orgId } = await requireAuth();
  const adminClient = createAdminClient();

  const { data: org } = await adminClient
    .from("organizations")
    .select("id, name, logo_url")
    .eq("id", orgId)
    .single();

  const { data: membership } = await adminClient
    .from("memberships")
    .select("role")
    .eq("org_id", orgId)
    .eq("user_id", user.id)
    .single();

  const { data: profile } = await adminClient
    .from("users")
    .select("full_name, avatar_url, email")
    .eq("id", user.id)
    .single();

  return (
    <div className="flex h-screen bg-stone-50 overflow-hidden">
      <Sidebar org={org!} userRole={membership?.role ?? "client"} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar user={profile!} orgName={org?.name ?? ""} />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
