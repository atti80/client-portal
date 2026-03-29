"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAuth } from "@/lib/actions/auth";
import type { DeliverableStatus } from "@/lib/types/database.types";

export async function uploadDeliverable(projectId: string, formData: FormData) {
  const { user, orgId } = await requireAuth();
  const adminClient = createAdminClient();

  const { data: membership } = await adminClient
    .from("project_members")
    .select("role")
    .eq("project_id", projectId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!membership) {
    return { error: "You do not have access to this project." };
  }

  const file = formData.get("file") as File;
  const title = formData.get("title") as string;

  if (!file || file.size === 0) return { error: "Please select a file." };
  if (!title?.trim())
    return { error: "Please enter a title for this deliverable." };
  if (file.size > 50 * 1024 * 1024)
    return { error: "File size must be under 50MB." };

  const timestamp = Date.now();
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const storagePath = `${orgId}/${projectId}/${timestamp}_${sanitizedName}`;

  const { error: uploadError } = await adminClient.storage
    .from("deliverables")
    .upload(storagePath, file, { contentType: file.type, upsert: false });

  if (uploadError) return { error: `Upload failed: ${uploadError.message}` };

  const { data: deliverable, error: dbError } = await adminClient
    .from("deliverables")
    .insert({
      project_id: projectId,
      uploaded_by: user.id,
      title: title.trim(),
      file_url: storagePath,
      file_name: file.name,
      status: "pending",
    })
    .select("id")
    .single();

  if (dbError || !deliverable) {
    await adminClient.storage.from("deliverables").remove([storagePath]);
    return { error: "Failed to save deliverable. Please try again." };
  }

  revalidatePath(`/projects/${projectId}`);
  return { error: null };
}

export async function updateDeliverableStatus(
  deliverableId: string,
  status: DeliverableStatus
) {
  const { user } = await requireAuth();
  const adminClient = createAdminClient();

  const { data: deliverable } = await adminClient
    .from("deliverables")
    .select("project_id")
    .eq("id", deliverableId)
    .single();

  if (!deliverable) return { error: "Deliverable not found." };

  const { data: membership } = await adminClient
    .from("project_members")
    .select("role")
    .eq("project_id", deliverable.project_id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!membership)
    return { error: "You do not have access to this deliverable." };

  const { error } = await adminClient
    .from("deliverables")
    .update({ status })
    .eq("id", deliverableId);

  if (error) return { error: "Failed to update status. Please try again." };

  revalidatePath(`/projects/${deliverable.project_id}`);
  return { error: null };
}

export async function deleteDeliverable(deliverableId: string) {
  const { user } = await requireAuth();
  const adminClient = createAdminClient();

  const { data: deliverable } = await adminClient
    .from("deliverables")
    .select("project_id, file_url, uploaded_by")
    .eq("id", deliverableId)
    .single();

  if (!deliverable) return { error: "Deliverable not found." };

  const { data: membership } = await adminClient
    .from("project_members")
    .select("role")
    .eq("project_id", deliverable.project_id)
    .eq("user_id", user.id)
    .maybeSingle();

  const canDelete =
    deliverable.uploaded_by === user.id || membership?.role === "owner";
  if (!canDelete)
    return { error: "You do not have permission to delete this deliverable." };

  const { error: storageError } = await adminClient.storage
    .from("deliverables")
    .remove([deliverable.file_url]);

  if (storageError) {
    return { error: "Failed to delete file from storage. Please try again." };
  }

  // Then delete DB record
  const { error } = await adminClient
    .from("deliverables")
    .delete()
    .eq("id", deliverableId);

  if (error)
    return { error: "Failed to delete deliverable. Please try again." };

  revalidatePath(`/projects/${deliverable.project_id}`);
  return { error: null };
}

export async function getDeliverableDownloadUrl(fileUrl: string) {
  const adminClient = createAdminClient();

  const { data, error } = await adminClient.storage
    .from("deliverables")
    .createSignedUrl(fileUrl, 60 * 60);

  if (error || !data)
    return { url: null, error: "Failed to generate download link." };
  return { url: data.signedUrl, error: null };
}
