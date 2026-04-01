"use client";

import { useState } from "react";
import { toast } from "sonner";
import { pdf } from "@react-pdf/renderer";
import { InvoiceDocument } from "@/components/invoices/InvoiceDocument";
import { createClient } from "@/lib/supabase/client";
import { InvoiceStatus } from "@/lib/types/database.types";

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

export function InvoicePDFButton({ invoiceId }: { invoiceId: string }) {
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data: invoice } = (await supabase
        .from("invoices")
        .select("*, projects(name), organizations(name)")
        .eq("id", invoiceId)
        .single()) as { data: InvoiceDetail | null };

      if (!invoice) throw new Error("Invoice not found");

      const { data: items } = await supabase
        .from("invoice_items")
        .select("*")
        .eq("invoice_id", invoiceId)
        .order("id");

      const blob = await pdf(
        <InvoiceDocument
          invoice={invoice}
          items={items ?? []}
          orgName={invoice.organizations?.name ?? "Unknown"}
          projectName={invoice.projects?.name}
        />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${invoice.number}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Failed to generate PDF.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="bg-secondary text-sm text-stone-100 hover:bg-secondary/90 hover:text-stone-200 border border-stone-200 rounded-md px-3 py-1.5 transition-colors disabled:opacity-50"
    >
      {loading ? "Generating..." : "Download PDF"}
    </button>
  );
}
