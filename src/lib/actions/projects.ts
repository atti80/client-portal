"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAuth } from "@/lib/actions/auth";
import type { ProjectStatus } from "@/lib/types/database.types";

export async function createProject(formData: FormData) {
  const { user, orgId } = await requireAuth();
  const adminClient = createAdminClient();

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const due_date = formData.get("due_date") as string;

  if (!name?.trim()) {
    return { error: "Project name is required." };
  }

  const { data: project, error: projectError } = await adminClient
    .from("projects")
    .insert({
      org_id: orgId,
      name: name.trim(),
      description: description?.trim() || null,
      due_date: due_date || null,
      status: "active",
    })
    .select("id")
    .single();

  if (projectError || !project) {
    return { error: "Failed to create project. Please try again." };
  }

  // Add owner to project_members
  await adminClient.from("project_members").insert({
    project_id: project.id,
    user_id: user.id,
    role: "owner",
  });

  revalidatePath("/projects");
  redirect(`/projects/${project.id}`);
}

export async function updateProject(projectId: string, formData: FormData) {
  const { orgId } = await requireAuth();
  const adminClient = createAdminClient();

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const due_date = formData.get("due_date") as string;

  if (!name?.trim()) {
    return { error: "Project name is required." };
  }

  const { data: project } = await adminClient
    .from("projects")
    .select("id")
    .eq("id", projectId)
    .eq("org_id", orgId)
    .single();

  if (!project) {
    return { error: "Project not found." };
  }

  const { error } = await adminClient
    .from("projects")
    .update({
      name: name.trim(),
      description: description?.trim() || null,
      due_date: due_date || null,
    })
    .eq("id", projectId);

  if (error) {
    return { error: "Failed to update project. Please try again." };
  }

  revalidatePath(`/projects/${projectId}`);
  return { error: null };
}

export async function updateProjectStatus(
  projectId: string,
  status: ProjectStatus
) {
  const { orgId } = await requireAuth();
  const adminClient = createAdminClient();

  const { data: project } = await adminClient
    .from("projects")
    .select("id")
    .eq("id", projectId)
    .eq("org_id", orgId)
    .single();

  if (!project) {
    return { error: "Project not found." };
  }

  const { error } = await adminClient
    .from("projects")
    .update({ status })
    .eq("id", projectId);

  if (error) {
    return { error: "Failed to update project status. Please try again." };
  }

  revalidatePath("/projects");
  revalidatePath(`/projects/${projectId}`);
  return { error: null };
}

export async function deleteProject(projectId: string) {
  const { orgId } = await requireAuth();
  const adminClient = createAdminClient();

  const { data: project } = await adminClient
    .from("projects")
    .select("id")
    .eq("id", projectId)
    .eq("org_id", orgId)
    .single();

  if (!project) {
    return { error: "Project not found." };
  }

  const { error } = await adminClient
    .from("projects")
    .delete()
    .eq("id", projectId);

  if (error) {
    return { error: "Failed to delete project. Please try again." };
  }

  revalidatePath("/projects");
  redirect("/projects");
}
