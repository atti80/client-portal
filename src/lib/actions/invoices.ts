"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAuth } from "@/lib/actions/auth";
import type { InvoiceStatus } from "@/lib/types/database.types";

export async function createInvoice(formData: FormData) {
  const { orgId } = await requireAuth();
  const adminClient = createAdminClient();

  const project_id = formData.get("project_id") as string;
  const due_date = formData.get("due_date") as string;
  const itemsJson = formData.get("items") as string;

  let items: { description: string; quantity: number; unit_price: number }[] =
    [];
  try {
    items = JSON.parse(itemsJson);
  } catch {
    return { error: "Invalid line items." };
  }

  if (!items.length) return { error: "At least one line item is required." };

  for (const item of items) {
    if (!item.description?.trim())
      return { error: "All line items need a description." };
    if (item.quantity <= 0)
      return { error: "Quantity must be greater than 0." };
    if (item.unit_price < 0) return { error: "Unit price cannot be negative." };
  }

  const { count } = await adminClient
    .from("invoices")
    .select("*", { count: "exact", head: true })
    .eq("org_id", orgId);

  const number = `INV-${String((count ?? 0) + 1).padStart(3, "0")}`;
  const total = items.reduce(
    (sum, item) => sum + item.quantity * item.unit_price,
    0
  );

  const { data: invoice, error: invoiceError } = await adminClient
    .from("invoices")
    .insert({
      org_id: orgId,
      project_id: project_id || null,
      number,
      status: "draft",
      total,
      due_date: due_date || null,
    })
    .select("id")
    .single();

  if (invoiceError || !invoice)
    return { error: "Failed to create invoice. Please try again." };

  const { error: itemsError } = await adminClient.from("invoice_items").insert(
    items.map((item) => ({
      invoice_id: invoice.id,
      description: item.description.trim(),
      quantity: item.quantity,
      unit_price: item.unit_price,
    }))
  );

  if (itemsError) {
    await adminClient.from("invoices").delete().eq("id", invoice.id);
    return { error: "Failed to save line items. Please try again." };
  }

  revalidatePath("/invoices");
  redirect(`/invoices/${invoice.id}`);
}

export async function updateInvoiceStatus(
  invoiceId: string,
  status: InvoiceStatus
) {
  const { orgId } = await requireAuth();
  const adminClient = createAdminClient();

  const { data: invoice } = await adminClient
    .from("invoices")
    .select("id")
    .eq("id", invoiceId)
    .eq("org_id", orgId)
    .single();

  if (!invoice) return { error: "Invoice not found." };

  const { error } = await adminClient
    .from("invoices")
    .update({ status })
    .eq("id", invoiceId);

  if (error)
    return { error: "Failed to update invoice status. Please try again." };

  revalidatePath("/invoices");
  revalidatePath(`/invoices/${invoiceId}`);
  return { error: null };
}

export async function deleteInvoice(invoiceId: string) {
  const { orgId } = await requireAuth();
  const adminClient = createAdminClient();

  const { data: invoice } = await adminClient
    .from("invoices")
    .select("id, status")
    .eq("id", invoiceId)
    .eq("org_id", orgId)
    .single();

  if (!invoice) return { error: "Invoice not found." };
  if (invoice.status === "paid")
    return { error: "Cannot delete a paid invoice." };

  const { error } = await adminClient
    .from("invoices")
    .delete()
    .eq("id", invoiceId);

  if (error) return { error: "Failed to delete invoice. Please try again." };

  revalidatePath("/invoices");
  redirect("/invoices");
}
