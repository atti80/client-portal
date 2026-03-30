"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import { updateOrg, updateOrgLogo, deleteOrg } from "@/lib/actions/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getInitials } from "@/lib/utils";

type Org = { id: string; name: string; slug: string; logo_url: string | null };

export function OrgSettingsForm({ org }: { org: Org }) {
  const [loading, setLoading] = useState(false);
  const [logoLoading, setLogoLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [slug, setSlug] = useState(org.slug);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleNameChange(name: string) {
    setSlug(
      name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim()
    );
  }

  async function handleSubmit(formData: FormData) {
    formData.set("slug", slug);
    setLoading(true);
    const result = await updateOrg(formData);
    setLoading(false);
    if (result?.error) toast.error(result.error);
    else toast.success("Organization updated.");
  }

  async function handleLogoUpload(formData: FormData) {
    setLogoLoading(true);
    const result = await updateOrgLogo(formData);
    setLogoLoading(false);
    if (result?.error) toast.error(result.error);
    else toast.success("Logo updated.");
  }

  async function handleDelete() {
    const confirmed = confirm(
      `Are you sure you want to delete "${org.name}"? This will permanently delete all projects, deliverables, invoices and members. This cannot be undone.`
    );
    if (!confirmed) return;
    const doubleConfirmed = confirm(
      "This is permanent. Are you absolutely sure?"
    );
    if (!doubleConfirmed) return;
    setDeleteLoading(true);
    const result = await deleteOrg();
    if (result?.error) {
      toast.error(result.error);
      setDeleteLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-sm font-semibold text-stone-900 mb-4">
          Organization logo
        </h2>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-lg bg-stone-200 flex items-center justify-center text-stone-600 font-semibold text-lg overflow-hidden flex-shrink-0">
            {org.logo_url ? (
              <img
                src={org.logo_url}
                alt={org.name}
                className="w-16 h-16 object-cover"
              />
            ) : (
              getInitials(org.name)
            )}
          </div>
          <div>
            <input
              ref={fileInputRef}
              name="logo"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  const fd = new FormData();
                  fd.set("logo", e.target.files[0]);
                  handleLogoUpload(fd);
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={logoLoading}
              onClick={() => fileInputRef.current?.click()}
              className="border-stone-200 text-stone-700 text-xs"
            >
              {logoLoading ? "Uploading..." : "Change logo"}
            </Button>
            <p className="text-xs text-stone-400 mt-1">PNG, JPG up to 2MB</p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-stone-900 mb-4">
          Organization details
        </h2>
        <form action={handleSubmit} className="space-y-4 max-w-sm">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-stone-700 text-sm">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              defaultValue={org.name}
              required
              onChange={(e) => handleNameChange(e.target.value)}
              className="bg-white border-stone-200"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="slug" className="text-stone-700 text-sm">
              Slug
            </Label>
            <Input
              id="slug"
              name="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              className="bg-white border-stone-200 font-mono text-sm"
            />
            <p className="text-xs text-stone-400">
              Used in URLs and references
            </p>
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="bg-stone-900 hover:bg-stone-700 text-white"
          >
            {loading ? "Saving..." : "Save changes"}
          </Button>
        </form>
      </div>

      <div className="border border-red-200 rounded-lg p-4">
        <h2 className="text-sm font-semibold text-red-700 mb-1">Danger zone</h2>
        <p className="text-xs text-stone-500 mb-3">
          Permanently delete this organization and all its data. This cannot be
          undone.
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={deleteLoading}
          onClick={handleDelete}
          className="border-red-200 text-red-600 hover:bg-red-50 text-xs"
        >
          {deleteLoading ? "Deleting..." : "Delete organization"}
        </Button>
      </div>
    </div>
  );
}
