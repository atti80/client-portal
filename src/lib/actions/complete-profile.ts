"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function completeProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const full_name = formData.get("full_name") as string;
  const password = formData.get("password") as string;

  if (!full_name.trim() || !password) {
    return { error: "All fields are required." };
  }
  // Set password via Supabase Auth
  const { error: passwordError } = await supabase.auth.updateUser({ password });
  if (passwordError) return { error: passwordError.message };

  const adminClient = createAdminClient();
  // Update full name in users table
  const { error: profileError } = await adminClient
    .from("users")
    .update({ full_name: full_name.trim() })
    .eq("id", user.id);

  if (profileError)
    return { error: "Failed to update profile. Please try again." };

  // Check for pending invitation and accept if exists
  const { data: invitation } = await adminClient
    .from("invitations")
    .select("id, org_id, role")
    .eq("email", user.email!)
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (invitation) {
    await adminClient.from("memberships").insert({
      org_id: invitation.org_id,
      user_id: user.id,
      role: invitation.role,
    });

    await adminClient
      .from("invitations")
      .update({ status: "accepted" })
      .eq("id", invitation.id);
  }

  redirect("/dashboard");
}
