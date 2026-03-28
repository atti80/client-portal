import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CompleteProfileForm } from "./form";

export default async function CompleteProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("User in CompleteProfilePage:", user?.email);
  if (!user) redirect("/login");

  // If they already have a full name and password, skip this page
  const { data: profile } = await supabase
    .from("users")
    .select("full_name")
    .eq("id", user.id)
    .single();

  if (profile?.full_name) redirect("/dashboard");

  return <CompleteProfileForm />;
}
