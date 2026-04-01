import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/actions/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatDate, formatCurrency } from "@/lib/utils";
import type { InvoiceStatus } from "@/lib/types/database.types";
import { InvoiceActions } from "./invoice-actions";
import { InvoicePDFButton } from "./pdf-button";
import { InvoiceStatusBadge } from "@/components/invoices/InvoiceStatusBadge";

type InvoiceDetail = {
  id: string;
  number: string;
  status: InvoiceStatus;
  total: number;
  due_date: string | null;
  created_at: string;
  project_id: string | null;
  projects: { name: string } | null;
  organizations: { name: string; logo_url: string | null } | null;
};

export default async function InvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { user, orgId } = await requireAuth();
  const adminClient = createAdminClient();

  const { data: membership } = await adminClient
    .from("memberships")
    .select("role")
    .eq("org_id", orgId)
    .eq("user_id", user.id)
    .single();

  const isClient = membership?.role === "client";
  const isOwner = membership?.role === "owner";

  const { data: invoice } = (await adminClient
    .from("invoices")
    .select("*, projects(name), organizations(name, logo_url)")
    .eq("id", id)
    .eq("org_id", orgId)
    .single()) as { data: InvoiceDetail | null };

  if (!invoice) notFound();

  if (isClient && invoice.project_id) {
    const { data: projectMembership } = await adminClient
      .from("project_members")
      .select("id")
      .eq("project_id", invoice.project_id)
      .eq("user_id", user.id)
      .maybeSingle();
    if (!projectMembership) notFound();
  }

  const { data: items } = await adminClient
    .from("invoice_items")
    .select("*")
    .eq("invoice_id", id)
    .order("id");

  const org = invoice.organizations;
  const project = invoice.projects;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold text-stone-900">
            {invoice.number}
          </h1>
          <InvoiceStatusBadge status={invoice.status} />
        </div>
        <div className="flex items-center gap-2">
          <InvoicePDFButton invoiceId={id} />
          {isOwner && (
            <InvoiceActions invoiceId={id} currentStatus={invoice.status} />
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-stone-200 p-6 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-lg font-semibold text-stone-900">{org?.name}</p>
            {project && (
              <p className="text-sm text-stone-500 mt-0.5">
                Project: {project.name}
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="text-xs text-stone-400">Invoice number</p>
            <p className="text-sm font-medium text-stone-900">
              {invoice.number}
            </p>
            {invoice.due_date && (
              <>
                <p className="text-xs text-stone-400 mt-2">Due date</p>
                <p className="text-sm font-medium text-stone-900">
                  {formatDate(invoice.due_date)}
                </p>
              </>
            )}
            <p className="text-xs text-stone-400 mt-2">Issued</p>
            <p className="text-sm font-medium text-stone-900">
              {formatDate(invoice.created_at)}
            </p>
          </div>
        </div>

        <div>
          <div className="grid grid-cols-12 gap-2 pb-2 border-b border-stone-100">
            <p className="col-span-6 text-xs font-medium text-stone-500">
              Description
            </p>
            <p className="col-span-2 text-xs font-medium text-stone-500 text-right">
              Qty
            </p>
            <p className="col-span-2 text-xs font-medium text-stone-500 text-right">
              Unit price
            </p>
            <p className="col-span-2 text-xs font-medium text-stone-500 text-right">
              Amount
            </p>
          </div>
          <div className="divide-y divide-stone-50">
            {items?.map((item) => (
              <div key={item.id} className="grid grid-cols-12 gap-2 py-2.5">
                <p className="col-span-6 text-sm text-stone-900">
                  {item.description}
                </p>
                <p className="col-span-2 text-sm text-stone-600 text-right">
                  {item.quantity}
                </p>
                <p className="col-span-2 text-sm text-stone-600 text-right">
                  {formatCurrency(item.unit_price)}
                </p>
                <p className="col-span-2 text-sm font-medium text-stone-900 text-right">
                  {formatCurrency(item.quantity * item.unit_price)}
                </p>
              </div>
            ))}
          </div>
          <div className="flex justify-end pt-3 border-t border-stone-100">
            <div className="text-right">
              <p className="text-xs text-stone-500">Total</p>
              <p className="text-2xl font-semibold text-stone-900">
                {formatCurrency(invoice.total)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
