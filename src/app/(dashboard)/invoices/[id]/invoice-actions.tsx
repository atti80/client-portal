"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateInvoiceStatus, deleteInvoice } from "@/lib/actions/invoices";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { InvoiceStatus } from "@/lib/types/database.types";

type Props = { invoiceId: string; currentStatus: string };

export function InvoiceActions({ invoiceId, currentStatus }: Props) {
  const router = useRouter();

  async function handleStatus(status: InvoiceStatus) {
    const result = await updateInvoiceStatus(invoiceId, status);
    if (result?.error) toast.error(result.error);
    else {
      toast.success("Invoice updated.");
      router.refresh();
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this invoice? This cannot be undone.")) return;
    const result = await deleteInvoice(invoiceId);
    if (result?.error) toast.error(result.error);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="bg-secondary text-sm text-stone-100 hover:bg-secondary/90 hover:text-stone-200 border border-stone-200 rounded-md px-3 py-1.5 transition-colors">
        Actions
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {currentStatus === "draft" && (
          <DropdownMenuItem onClick={() => handleStatus("sent")}>
            Mark as sent
          </DropdownMenuItem>
        )}
        {currentStatus === "sent" && (
          <DropdownMenuItem onClick={() => handleStatus("paid")}>
            Mark as paid
          </DropdownMenuItem>
        )}
        {currentStatus === "sent" && (
          <DropdownMenuItem onClick={() => handleStatus("draft")}>
            Revert to draft
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleDelete}
          className="text-red-600 focus:text-red-600"
          disabled={currentStatus === "paid"}
        >
          Delete invoice
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
