import Link from "next/link";
import { requireAuth } from "@/lib/actions/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatDate } from "@/lib/utils";

export default async function DashboardPage() {
  const { user, orgId } = await requireAuth();
  const adminClient = createAdminClient();

  const { data: projectIds } = await adminClient
    .from("project_members")
    .select("project_id")
    .eq("user_id", user.id);

  const ids = projectIds?.map((p) => p.project_id) ?? [];

  const { data: projects } = await adminClient
    .from("projects")
    .select("id, name, status, due_date, created_at")
    .eq("org_id", orgId)
    .in("id", ids)
    .order("created_at", { ascending: false })
    .limit(5);

  const { data: deliverables } = await adminClient
    .from("deliverables")
    .select("id, title, status, created_at, project_id, projects(name)")
    .in("project_id", ids)
    .order("created_at", { ascending: false })
    .limit(5);

  const activeProjects = projects?.filter((p) => p.status === "active") ?? [];
  const pendingDeliverables =
    deliverables?.filter((d) => d.status === "pending") ?? [];

  return (
    <div className="max-w-4xl space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active projects", value: activeProjects.length },
          { label: "Total projects", value: projects?.length ?? 0 },
          { label: "Pending reviews", value: pendingDeliverables.length },
          { label: "Recent uploads", value: deliverables?.length ?? 0 },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="bg-white rounded-lg border border-stone-200 px-4 py-4"
          >
            <p className="text-2xl font-semibold text-stone-900">{value}</p>
            <p className="text-xs text-stone-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-stone-900">
            Recent projects
          </h2>
          <Link
            href="/projects"
            className="text-xs text-stone-500 hover:text-stone-900 transition-colors"
          >
            View all →
          </Link>
        </div>
        {projects && projects.length > 0 ? (
          <div className="bg-white rounded-lg border border-stone-200 divide-y divide-stone-100">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="flex items-center justify-between px-4 py-3 hover:bg-stone-50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${project.status === "active" ? "bg-green-500" : project.status === "completed" ? "bg-stone-400" : "bg-stone-300"}`}
                  />
                  <span className="text-sm text-stone-900 truncate">
                    {project.name}
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-4">
                  {project.due_date && (
                    <span className="text-xs text-stone-400">
                      Due {formatDate(project.due_date)}
                    </span>
                  )}
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${project.status === "active" ? "bg-green-50 text-green-700" : project.status === "completed" ? "bg-stone-100 text-stone-600" : "bg-stone-100 text-stone-400"}`}
                  >
                    {project.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-stone-200 px-4 py-8 text-center">
            <p className="text-sm text-stone-500">No projects yet.</p>
            <Link
              href="/projects/new"
              className="text-sm text-stone-900 underline underline-offset-2 mt-1 inline-block"
            >
              Create your first project
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
