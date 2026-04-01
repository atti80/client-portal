"use client";

import { useState, useTransition } from "react";
import { createOrg } from "@/lib/actions/organization";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function OnboardingForm() {
  const [error, setError] = useState<string | null>(null);
  const [orgName, setOrgName] = useState("");
  const [isPending, startTransition] = useTransition();

  const slug = orgName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();

  async function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await createOrg(formData);
      if (result?.error) {
        setError(result.error);
      }
    });
  }

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-8">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <span className="text-stone-900 font-semibold text-xl tracking-tight">
            ClientFlow
          </span>
        </div>

        <h1 className="text-2xl font-semibold text-stone-900 mb-1">
          Name your workspace
        </h1>
        <p className="text-stone-500 text-sm mb-8">
          This is how your clients will identify your business. You can change
          it later in settings.
        </p>

        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-stone-700 text-sm">
              Organization name
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Studio Nova"
              required
              autoFocus
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              className="bg-white border-stone-200 text-stone-900 placeholder:text-stone-400 focus-visible:ring-stone-400"
            />
            {slug && (
              <p className="text-stone-400 text-xs">
                Your workspace slug:{" "}
                <span className="text-stone-600 font-mono">{slug}</span>
              </p>
            )}
          </div>

          <input type="hidden" name="slug" value={slug} />

          {error && (
            <p className="text-red-600 text-sm bg-red-50 border border-red-100 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={isPending || !orgName.trim()}
            className="w-full bg-stone-900 hover:bg-stone-700 text-white"
          >
            {isPending ? "Creating workspace..." : "Create workspace"}
          </Button>
        </form>
      </div>
    </div>
  );
}
