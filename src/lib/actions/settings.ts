"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAuth } from "@/lib/actions/auth";

export async function updateOrg(formData: FormData) {
  const { orgId } = await requireAuth();
  const adminClient = createAdminClient();

  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;

  if (!name?.trim()) return { error: "Organization name is required." };
  if (!slug?.trim()) return { error: "Slug is required." };

  const { data: existing } = await adminClient
    .from("organizations")
    .select("id")
    .eq("slug", slug)
    .neq("id", orgId)
    .maybeSingle();

  if (existing) return { error: "That slug is already taken." };

  const { error } = await adminClient
    .from("organizations")
    .update({ name: name.trim(), slug: slug.trim() })
    .eq("id", orgId);

  if (error)
    return { error: "Failed to update organization. Please try again." };

  revalidatePath("/settings");
  return { error: null };
}

export async function updateOrgLogo(formData: FormData) {
  const { orgId } = await requireAuth();
  const adminClient = createAdminClient();

  const file = formData.get("logo") as File;
  if (!file || file.size === 0) return { error: "Please select an image." };
  if (file.size > 2 * 1024 * 1024) return { error: "Image must be under 2MB." };
  if (!file.type.startsWith("image/"))
    return { error: "File must be an image." };

  const ext = file.name.split(".").pop();
  const storagePath = `${orgId}/logo.${ext}`;

  const { error: uploadError } = await adminClient.storage
    .from("org-logos")
    .upload(storagePath, file, { contentType: file.type, upsert: true });

  if (uploadError) return { error: `Upload failed: ${uploadError.message}` };

  const {
    data: { publicUrl },
  } = adminClient.storage.from("org-logos").getPublicUrl(storagePath);

  const { error } = await adminClient
    .from("organizations")
    .update({ logo_url: publicUrl })
    .eq("id", orgId);

  if (error) return { error: "Failed to save logo. Please try again." };

  revalidatePath("/settings");
  return { error: null };
}

export async function deleteOrg() {
  const { user, orgId } = await requireAuth();
  const adminClient = createAdminClient();

  const { data: membership } = await adminClient
    .from("memberships")
    .select("role")
    .eq("org_id", orgId)
    .eq("user_id", user.id)
    .single();

  if (membership?.role !== "owner")
    return { error: "Only the owner can delete the organization." };

  const { error } = await adminClient
    .from("organizations")
    .delete()
    .eq("id", orgId);

  if (error)
    return { error: "Failed to delete organization. Please try again." };

  redirect("/login");
}

export async function updateProfile(formData: FormData) {
  const { user } = await requireAuth();
  const adminClient = createAdminClient();

  const full_name = formData.get("full_name") as string;
  if (!full_name?.trim()) return { error: "Full name is required." };

  const { error } = await adminClient
    .from("users")
    .update({ full_name: full_name.trim() })
    .eq("id", user.id);

  if (error) return { error: "Failed to update profile. Please try again." };

  revalidatePath("/settings/profile");
  return { error: null };
}

export async function updateAvatar(formData: FormData) {
  const { user } = await requireAuth();
  const adminClient = createAdminClient();

  const file = formData.get("avatar") as File;
  if (!file || file.size === 0) return { error: "Please select an image." };
  if (file.size > 2 * 1024 * 1024) return { error: "Image must be under 2MB." };
  if (!file.type.startsWith("image/"))
    return { error: "File must be an image." };

  const ext = file.name.split(".").pop();
  const storagePath = `${user.id}/avatar.${ext}`;

  const { error: uploadError } = await adminClient.storage
    .from("avatars")
    .upload(storagePath, file, { contentType: file.type, upsert: true });

  if (uploadError) return { error: `Upload failed: ${uploadError.message}` };

  const {
    data: { publicUrl },
  } = adminClient.storage.from("avatars").getPublicUrl(storagePath);

  const { error } = await adminClient
    .from("users")
    .update({ avatar_url: publicUrl })
    .eq("id", user.id);

  if (error) return { error: "Failed to save avatar. Please try again." };

  revalidatePath("/settings/profile");
  return { error: null };
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirm = formData.get("confirm") as string;

  if (!password || password.length < 8)
    return { error: "Password must be at least 8 characters." };
  if (password !== confirm) return { error: "Passwords do not match." };

  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: error.message };

  return { error: null };
}
