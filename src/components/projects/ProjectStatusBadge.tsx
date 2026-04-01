import type { ProjectStatus } from "@/lib/types/database.types";

const styles: Record<ProjectStatus, string> = {
  active: "bg-green-50 text-green-700",
  completed: "bg-stone-100 text-stone-600",
  archived: "bg-stone-100 text-stone-400",
};

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <span
      className={`text-xs font-medium px-2 py-0.5 rounded-full ${styles[status]}`}
    >
      {status}
    </span>
  );
}
