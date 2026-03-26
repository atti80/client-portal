import { Button } from "@/components/ui/button";
import { logout } from "@/lib/actions/auth";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: membership } = await supabase
    .from("memberships")
    .select("org_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!membership) redirect("/onboarding");

  return (
    <div>
      <h2>Dashboard page</h2>
      <form action={logout}>
        <Button type="submit">Sign out</Button>
      </form>
    </div>
  );
}
