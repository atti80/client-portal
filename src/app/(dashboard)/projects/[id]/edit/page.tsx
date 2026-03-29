import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/actions/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { EditProjectForm } from "./form";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { user, orgId } = await requireAuth();
  const adminClient = createAdminClient();

  // Only owners and members can edit
  const { data: membership } = await adminClient
    .from("project_members")
    .select("role")
    .eq("project_id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!membership || !["owner", "member"].includes(membership.role)) {
    notFound();
  }

  const { data: project } = await adminClient
    .from("projects")
    .select("id, name, description, due_date, status")
    .eq("id", id)
    .eq("org_id", orgId)
    .single();

  if (!project) notFound();

  return (
    <div className="max-w-xl">
      <h1 className="text-xl font-semibold text-stone-900 mb-6">
        Edit project
      </h1>
      <EditProjectForm project={project} />
    </div>
  );
}
