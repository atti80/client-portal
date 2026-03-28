"use client";

import { useState } from "react";
import { completeProfile } from "@/lib/actions/complete-profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CompleteProfileForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setLoading(true);
    const result = await completeProfile(formData);
    setLoading(false);
    if (result?.error) setError(result.error);
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
          Complete your profile
        </h1>
        <p className="text-stone-500 text-sm mb-8">
          Set your name and a password to finish setting up your account.
        </p>

        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="full_name" className="text-stone-700 text-sm">
              Full name
            </Label>
            <Input
              id="full_name"
              name="full_name"
              type="text"
              placeholder="Sara Kovač"
              required
              autoFocus
              className="bg-white border-stone-200 text-stone-900 placeholder:text-stone-400 focus-visible:ring-stone-400"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-stone-700 text-sm">
              Choose a password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="At least 8 characters"
              required
              minLength={8}
              className="bg-white border-stone-200 text-stone-900 placeholder:text-stone-400 focus-visible:ring-stone-400"
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm bg-red-50 border border-red-100 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-stone-900 hover:bg-stone-700 text-white"
          >
            {loading ? "Saving..." : "Complete setup"}
          </Button>
        </form>
      </div>
    </div>
  );
}
