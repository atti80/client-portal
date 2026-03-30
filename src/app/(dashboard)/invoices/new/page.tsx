import { requireAuth } from "@/lib/actions/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { NewInvoiceForm } from "@/components/invoices/InvoiceForm";

export default async function NewInvoicePage() {
  const { user, orgId } = await requireAuth();
  const adminClient = createAdminClient();

  const { data: membership } = await adminClient
    .from("memberships")
    .select("role")
    .eq("org_id", orgId)
    .eq("user_id", user.id)
    .single();

  if (membership?.role !== "owner") redirect("/invoices");

  const { data: projects } = await adminClient
    .from("projects")
    .select("id, name")
    .eq("org_id", orgId)
    .eq("status", "active")
    .order("name");

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-semibold text-stone-900 mb-6">New invoice</h1>
      <NewInvoiceForm projects={projects ?? []} />
    </div>
  );
}
