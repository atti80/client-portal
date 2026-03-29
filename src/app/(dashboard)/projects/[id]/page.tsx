import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/actions/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatDate } from "@/lib/utils";
import { ProjectActions } from "./actions-menu";
import { DeliverableList } from "@/components/deliverables/DeliverableList";
import type { DeliverableStatus } from "@/lib/types/database.types";

type ProjectMember = {
  role: string;
  users: {
    id: string;
    full_name: string | null;
    email: string;
    avatar_url: string | null;
  } | null;
};

type Comment = {
  id: string;
  body: string;
  created_at: string;
  user_id: string;
  users: {
    full_name: string | null;
    email: string;
    avatar_url: string | null;
  } | null;
};

type Deliverable = {
  id: string;
  title: string;
  file_name: string;
  file_url: string;
  status: DeliverableStatus;
  created_at: string;
  uploaded_by: string;
  users: { full_name: string | null; email: string } | null;
  comments: Comment[];
};

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { user, orgId } = await requireAuth();
  const adminClient = createAdminClient();

  const { data: membership } = await adminClient
    .from("project_members")
    .select("role")
    .eq("project_id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!membership) notFound();

  const { data: project } = await adminClient
    .from("projects")
    .select("*")
    .eq("id", id)
    .eq("org_id", orgId)
    .single();

  if (!project) notFound();

  const { data: members } = (await adminClient
    .from("project_members")
    .select("role, users(id, full_name, email, avatar_url)")
    .eq("project_id", id)) as { data: ProjectMember[] | null };

  const { data: deliverables } = (await adminClient
    .from("deliverables")
    .select(
      `
      id, title, file_name, file_url, status, created_at, uploaded_by,
      users(full_name, email),
      comments(id, body, created_at, user_id, users(full_name, email, avatar_url))
    `
    )
    .eq("project_id", id)
    .order("created_at", { ascending: false })) as {
    data: Deliverable[] | null;
  };

  const isOwnerOrMember = ["owner", "member"].includes(membership.role);

  return (
    <div className="max-w-4xl">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-semibold text-stone-900">
              {project.name}
            </h1>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${project.status === "active" ? "bg-green-50 text-green-700" : project.status === "completed" ? "bg-stone-100 text-stone-600" : "bg-stone-100 text-stone-400"}`}
            >
              {project.status}
            </span>
          </div>
          {project.description && (
            <p className="text-sm text-stone-500">{project.description}</p>
          )}
          {project.due_date && (
            <p className="text-xs text-stone-400 mt-1">
              Due {formatDate(project.due_date)}
            </p>
          )}
        </div>
        {isOwnerOrMember && (
          <ProjectActions
            projectId={project.id}
            currentStatus={project.status}
          />
        )}
      </div>

      <div className="bg-white rounded-lg border border-stone-200 p-4 mb-6">
        <p className="text-xs font-medium text-stone-500 uppercase tracking-wider mb-3">
          Team
        </p>
        <div className="flex flex-wrap gap-2">
          {members?.map((m) => {
            const u = m.users;
            if (!u) return null;
            const name = u.full_name || u.email;
            return (
              <div
                key={u.id}
                className="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-full px-3 py-1"
              >
                <div className="w-5 h-5 rounded-full bg-stone-200 flex items-center justify-center text-stone-600 text-xs font-medium overflow-hidden">
                  {u.avatar_url ? (
                    <img
                      src={u.avatar_url}
                      alt={name}
                      className="w-5 h-5 object-cover"
                    />
                  ) : (
                    name[0]?.toUpperCase()
                  )}
                </div>
                <span className="text-xs text-stone-700">{name}</span>
                <span className="text-xs text-stone-400">{m.role}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-stone-200 p-4">
        <DeliverableList
          projectId={project.id}
          deliverables={deliverables ?? []}
          currentUserId={user.id}
          userRole={membership.role}
        />
      </div>
    </div>
  );
}
