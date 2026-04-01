import Link from "next/link";
import { requireAuth } from "@/lib/actions/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatDate } from "@/lib/utils";

export default async function ProjectsPage() {
  const { user, orgId } = await requireAuth();
  const adminClient = createAdminClient();

  const { data: projectIds } = await adminClient
    .from("project_members")
    .select("project_id")
    .eq("user_id", user.id);

  const ids = projectIds?.map((p) => p.project_id) ?? [];

  const { data: projects } = await adminClient
    .from("projects")
    .select("id, name, status, description, due_date, created_at")
    .eq("org_id", orgId)
    .in("id", ids)
    .order("created_at", { ascending: false });

  const active = projects?.filter((p) => p.status === "active") ?? [];
  const completed = projects?.filter((p) => p.status === "completed") ?? [];
  const archived = projects?.filter((p) => p.status === "archived") ?? [];

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-stone-900">Projects</h1>
        <Link
          href="/projects/new"
          className="text-sm bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md transition-colors"
        >
          New project
        </Link>
      </div>
      {!projects || projects.length === 0 ? (
        <div className="bg-white rounded-lg border border-stone-200 px-4 py-16 text-center">
          <p className="text-stone-500 text-sm">No projects yet.</p>
          <Link
            href="/projects/new"
            className="text-sm text-stone-900 underline underline-offset-2 mt-1 inline-block"
          >
            Create your first project
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {active.length > 0 && (
            <ProjectGroup title="Active" projects={active} />
          )}
          {completed.length > 0 && (
            <ProjectGroup title="Completed" projects={completed} />
          )}
          {archived.length > 0 && (
            <ProjectGroup title="Archived" projects={archived} />
          )}
        </div>
      )}
    </div>
  );
}

type Project = {
  id: string;
  name: string;
  status: string;
  description: string | null;
  due_date: string | null;
  created_at: string;
};

function ProjectGroup({
  title,
  projects,
}: {
  title: string;
  projects: Project[];
}) {
  return (
    <div>
      <p className="text-xs font-medium text-stone-400 uppercase tracking-wider mb-2">
        {title} ({projects.length})
      </p>
      <div className="bg-white rounded-lg border border-stone-200 divide-y divide-stone-100">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.id}`}
            className="flex items-start justify-between px-4 py-4 hover:bg-stone-50 transition-colors"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-stone-900">
                {project.name}
              </p>
              {project.description && (
                <p className="text-xs text-stone-400 mt-0.5 truncate">
                  {project.description}
                </p>
              )}
            </div>
            <div className="ml-4 shrink-0 text-right">
              {project.due_date && (
                <p className="text-xs text-stone-400">
                  Due {formatDate(project.due_date)}
                </p>
              )}
              <p className="text-xs text-stone-400 mt-0.5">
                Created {formatDate(project.created_at)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
