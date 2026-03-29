"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAuth } from "@/lib/actions/auth";

type CommentWithDeliverable = {
  user_id: string;
  deliverables: {
    project_id: string;
  } | null;
};

export async function addComment(deliverableId: string, formData: FormData) {
  const { user } = await requireAuth();
  const adminClient = createAdminClient();

  const body = formData.get("body") as string;

  if (!body?.trim()) {
    return { error: "Comment cannot be empty." };
  }

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

  const { error } = await adminClient.from("comments").insert({
    deliverable_id: deliverableId,
    user_id: user.id,
    body: body.trim(),
  });

  if (error) return { error: "Failed to post comment. Please try again." };

  revalidatePath(`/projects/${deliverable.project_id}`);
  return { error: null };
}

export async function deleteComment(commentId: string) {
  const { user } = await requireAuth();
  const adminClient = createAdminClient();

  const { data: comment } = (await adminClient
    .from("comments")
    .select("user_id, deliverables(project_id)")
    .eq("id", commentId)
    .single()) as { data: CommentWithDeliverable | null };

  if (!comment) return { error: "Comment not found." };
  if (comment.user_id !== user.id)
    return { error: "You can only delete your own comments." };

  const { error } = await adminClient
    .from("comments")
    .delete()
    .eq("id", commentId);

  if (error) return { error: "Failed to delete comment. Please try again." };

  const projectId = comment.deliverables?.project_id;
  if (projectId) revalidatePath(`/projects/${projectId}`);
  return { error: null };
}
