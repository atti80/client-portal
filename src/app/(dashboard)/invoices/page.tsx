import Link from "next/link";
import { requireAuth } from "@/lib/actions/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatDate, formatCurrency } from "@/lib/utils";
import type { InvoiceStatus } from "@/lib/types/database.types";
import { InvoiceStatusBadge } from "@/components/invoices/InvoiceStatusBadge";

type InvoiceWithRelations = {
  id: string;
  number: string;
  status: InvoiceStatus;
  total: number;
  due_date: string | null;
  created_at: string;
  projects: { name: string } | null;
};

export default async function InvoicesPage() {
  const { user, orgId } = await requireAuth();
  const adminClient = createAdminClient();

  const { data: membership } = await adminClient
    .from("memberships")
    .select("role")
    .eq("org_id", orgId)
    .eq("user_id", user.id)
    .single();

  const isClient = membership?.role === "client";

  let query = adminClient
    .from("invoices")
    .select("id, number, status, total, due_date, created_at, projects(name)")
    .eq("org_id", orgId)
    .order("created_at", { ascending: false });

  if (isClient) {
    const { data: projectIds } = await adminClient
      .from("project_members")
      .select("project_id")
      .eq("user_id", user.id);
    const ids = projectIds?.map((p) => p.project_id) ?? [];
    if (ids.length === 0) {
      return (
        <div className="max-w-4xl">
          <h1 className="text-xl font-semibold text-stone-900 mb-6">
            Invoices
          </h1>
          <div className="bg-white rounded-lg border border-stone-200 px-4 py-16 text-center">
            <p className="text-stone-500 text-sm">No invoices yet.</p>
          </div>
        </div>
      );
    }
    query = query.in("project_id", ids);
  }

  const { data: invoices } = (await query) as {
    data: InvoiceWithRelations[] | null;
  };

  const total = invoices?.reduce((sum, inv) => sum + inv.total, 0) ?? 0;
  const paid =
    invoices
      ?.filter((i) => i.status === "paid")
      .reduce((sum, inv) => sum + inv.total, 0) ?? 0;
  const outstanding =
    invoices
      ?.filter((i) => i.status !== "paid")
      .reduce((sum, inv) => sum + inv.total, 0) ?? 0;

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-stone-900">Invoices</h1>
        {!isClient && (
          <Link
            href="/invoices/new"
            className="text-sm bg-stone-900 hover:bg-stone-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            New invoice
          </Link>
        )}
      </div>

      {invoices && invoices.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Total invoiced", value: formatCurrency(total) },
            { label: "Paid", value: formatCurrency(paid) },
            { label: "Outstanding", value: formatCurrency(outstanding) },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="bg-white rounded-lg border border-stone-200 px-4 py-4"
            >
              <p className="text-xl font-semibold text-stone-900">{value}</p>
              <p className="text-xs text-stone-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      )}

      {!invoices || invoices.length === 0 ? (
        <div className="bg-white rounded-lg border border-stone-200 px-4 py-16 text-center">
          <p className="text-stone-500 text-sm">No invoices yet.</p>
          {!isClient && (
            <Link
              href="/invoices/new"
              className="text-sm text-stone-900 underline underline-offset-2 mt-1 inline-block"
            >
              Create your first invoice
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-stone-200 divide-y divide-stone-100">
          {invoices.map((invoice) => (
            <Link
              key={invoice.id}
              href={`/invoices/${invoice.id}`}
              className="flex items-center justify-between px-4 py-3 hover:bg-stone-50 transition-colors"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-stone-900">
                    {invoice.number}
                  </p>
                  <InvoiceStatusBadge status={invoice.status} />
                </div>
                <p className="text-xs text-stone-400 mt-0.5">
                  {invoice.projects?.name ?? "No project"}
                  {invoice.due_date && ` · Due ${formatDate(invoice.due_date)}`}
                </p>
              </div>
              <p className="text-sm font-medium text-stone-900 ml-4 shrink-0">
                {formatCurrency(invoice.total)}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
