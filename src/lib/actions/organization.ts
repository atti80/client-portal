"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function createOrg(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const name = formData.get("name") as string;
  // Regenerate slug on the server — don't trust the client value
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();

  if (!name.trim() || !slug.trim()) {
    return { error: "Organization name is required." };
  }

  // Use service role for inserts that happen outside RLS context
  const adminClient = createAdminClient();

  const { data: existing } = await adminClient
    .from("organizations")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (existing) {
    return {
      error: "That workspace name is already taken. Try a different one.",
    };
  }

  const { data: org, error: orgError } = await adminClient
    .from("organizations")
    .insert({ name: name.trim(), slug })
    .select("id")
    .single();

  if (orgError || !org) {
    return { error: "Failed to create workspace. Please try again." };
  }

  const { error: membershipError } = await adminClient
    .from("memberships")
    .insert({
      org_id: org.id,
      user_id: user.id,
      role: "owner",
    });

  if (membershipError) {
    await adminClient.from("organizations").delete().eq("id", org.id);
    return { error: "Failed to set up workspace. Please try again." };
  }

  redirect("/dashboard");
}
