"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import { uploadDeliverable } from "@/lib/actions/deliverables";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  projectId: string;
  onSuccessAction: () => void;
  onCancelAction: () => void;
};

export function DeliverableUploadForm({
  projectId,
  onSuccessAction,
  onCancelAction,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setLoading(true);
    const result = await uploadDeliverable(projectId, formData);
    setLoading(false);
    if (result?.error) {
      setError(result.error);
    } else {
      toast.success("File uploaded successfully.");
      onSuccessAction();
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="title" className="text-stone-700 text-sm">
          Title
        </Label>
        <Input
          id="title"
          name="title"
          type="text"
          placeholder="Homepage mockup v2"
          required
          autoFocus
          className="bg-white border-stone-200"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="file" className="text-stone-700 text-sm">
          File
        </Label>
        <div
          className="border border-dashed border-stone-300 rounded-lg px-4 py-6 text-center cursor-pointer hover:border-stone-400 hover:bg-stone-50 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          {fileName ? (
            <div>
              <p className="text-sm text-stone-900 font-medium truncate">
                {fileName}
              </p>
              <p className="text-xs text-stone-400 mt-0.5">Click to change</p>
            </div>
          ) : (
            <div>
              <p className="text-sm text-stone-500">Click to select a file</p>
              <p className="text-xs text-stone-400 mt-0.5">Max 50MB</p>
            </div>
          )}
          <input
            ref={fileInputRef}
            id="file"
            name="file"
            type="file"
            required
            className="hidden"
            onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
          />
        </div>
      </div>

      {error && (
        <p className="text-red-600 text-sm bg-red-50 border border-red-100 rounded-md px-3 py-2">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={loading}
          className="bg-stone-900 hover:bg-stone-700 text-white"
        >
          {loading ? "Uploading..." : "Upload"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancelAction}
          disabled={loading}
          className="border-stone-200 text-stone-700"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
