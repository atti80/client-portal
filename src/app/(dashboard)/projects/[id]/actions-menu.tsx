"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateProjectStatus, deleteProject } from "@/lib/actions/projects";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ProjectStatus } from "@/lib/types/database.types";

type Props = { projectId: string; currentStatus: string };

export function ProjectActions({ projectId, currentStatus }: Props) {
  const router = useRouter();

  async function handleStatusChange(status: ProjectStatus) {
    const result = await updateProjectStatus(projectId, status);
    if (result?.error) toast.error(result.error);
    else {
      toast.success("Project status updated.");
      router.refresh();
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this project? This cannot be undone.")) return;
    const result = await deleteProject(projectId);
    if (result?.error) toast.error(result.error);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="text-sm text-stone-500 hover:text-stone-900 border border-stone-200 rounded-md px-3 py-1.5 transition-colors">
        Actions
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <a href={`/projects/${projectId}/edit`}>Edit project</a>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {currentStatus !== "active" && (
          <DropdownMenuItem onClick={() => handleStatusChange("active")}>
            Mark as active
          </DropdownMenuItem>
        )}
        {currentStatus !== "completed" && (
          <DropdownMenuItem onClick={() => handleStatusChange("completed")}>
            Mark as completed
          </DropdownMenuItem>
        )}
        {currentStatus !== "archived" && (
          <DropdownMenuItem onClick={() => handleStatusChange("archived")}>
            Archive project
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleDelete}
          className="text-red-600 focus:text-red-600"
        >
          Delete project
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
