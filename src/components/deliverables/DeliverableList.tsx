"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  updateDeliverableStatus,
  deleteDeliverable,
  getDeliverableDownloadUrl,
} from "@/lib/actions/deliverables";
import { DeliverableUploadForm } from "./DeliverableUploadForm";
import { formatDate } from "@/lib/utils";
import type { DeliverableStatus } from "@/lib/types/database.types";

type Deliverable = {
  id: string;
  title: string;
  file_name: string;
  file_url: string;
  status: DeliverableStatus;
  created_at: string;
  uploaded_by: string;
  users: { full_name: string | null; email: string } | null;
};

type Props = {
  projectId: string;
  deliverables: Deliverable[];
  currentUserId: string;
  userRole: string;
};

const statusStyles: Record<DeliverableStatus, string> = {
  pending: "bg-stone-100 text-stone-600",
  approved: "bg-green-50 text-green-700",
  revision_requested: "bg-amber-50 text-amber-700",
};

const statusLabels: Record<DeliverableStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  revision_requested: "Revision requested",
};

export function DeliverableList({
  projectId,
  deliverables,
  currentUserId,
  userRole,
}: Props) {
  const [showUpload, setShowUpload] = useState(false);
  const router = useRouter();

  async function handleDownload(fileUrl: string) {
    const { url, error } = await getDeliverableDownloadUrl(fileUrl);
    if (error || !url) {
      toast.error("Failed to generate download link.");
      return;
    }
    window.open(url, "_blank");
  }

  async function handleStatusChange(
    deliverableId: string,
    status: DeliverableStatus
  ) {
    const result = await updateDeliverableStatus(deliverableId, status);
    if (result?.error) toast.error(result.error);
    else {
      toast.success("Status updated.");
      router.refresh();
    }
  }

  async function handleDelete(deliverableId: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    const result = await deleteDeliverable(deliverableId);
    if (result?.error) toast.error(result.error);
    else {
      toast.success("Deliverable deleted.");
      router.refresh();
    }
  }

  const isOwner = userRole === "owner";
  const isOwnerOrMember = ["owner", "member"].includes(userRole);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">
          Deliverables ({deliverables.length})
        </p>
        {!showUpload && (
          <button
            onClick={() => setShowUpload(true)}
            className="text-xs text-stone-500 hover:text-stone-900 transition-colors"
          >
            + Upload file
          </button>
        )}
      </div>

      {showUpload && (
        <div className="mb-4 p-4 bg-stone-50 rounded-lg border border-stone-200">
          <DeliverableUploadForm
            projectId={projectId}
            onSuccessAction={() => {
              setShowUpload(false);
              router.refresh();
            }}
            onCancelAction={() => setShowUpload(false)}
          />
        </div>
      )}

      {deliverables.length === 0 && !showUpload ? (
        <p className="text-sm text-stone-400 text-center py-6">
          No deliverables yet.
        </p>
      ) : (
        <div className="divide-y divide-stone-100">
          {deliverables.map((d) => {
            const uploaderName =
              d.users?.full_name || d.users?.email || "Unknown";
            const canDelete = d.uploaded_by === currentUserId || isOwner;
            return (
              <div
                key={d.id}
                className="flex items-start justify-between py-3 gap-4"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-stone-900">
                      {d.title}
                    </p>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusStyles[d.status]}`}
                    >
                      {statusLabels[d.status]}
                    </span>
                  </div>
                  <p className="text-xs text-stone-400 mt-0.5">
                    {d.file_name} · Uploaded by {uploaderName} ·{" "}
                    {formatDate(d.created_at)}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleDownload(d.file_url)}
                    className="text-xs text-stone-500 hover:text-stone-900 transition-colors"
                  >
                    Download
                  </button>
                  {d.status !== "approved" && (
                    <button
                      onClick={() => handleStatusChange(d.id, "approved")}
                      className="text-xs text-green-600 hover:text-green-700 transition-colors"
                    >
                      Approve
                    </button>
                  )}
                  {d.status !== "revision_requested" && (
                    <button
                      onClick={() =>
                        handleStatusChange(d.id, "revision_requested")
                      }
                      className="text-xs text-amber-600 hover:text-amber-700 transition-colors"
                    >
                      Request revision
                    </button>
                  )}
                  {d.status !== "pending" && isOwnerOrMember && (
                    <button
                      onClick={() => handleStatusChange(d.id, "pending")}
                      className="text-xs text-stone-400 hover:text-stone-600 transition-colors"
                    >
                      Reset
                    </button>
                  )}
                  {canDelete && (
                    <button
                      onClick={() => handleDelete(d.id, d.title)}
                      className="text-xs text-stone-400 hover:text-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
