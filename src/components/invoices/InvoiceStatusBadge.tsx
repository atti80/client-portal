import type { InvoiceStatus } from "@/lib/types/database.types";

const styles: Record<InvoiceStatus, string> = {
  draft: "bg-stone-100 text-stone-600",
  sent: "bg-blue-50 text-blue-700",
  paid: "bg-green-50 text-green-700",
};

export function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  return (
    <span
      className={`text-xs font-medium px-2 py-0.5 rounded-full ${styles[status]}`}
    >
      {status}
    </span>
  );
}
