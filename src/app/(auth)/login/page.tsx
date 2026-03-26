"use client";

import { useState } from "react";
import Link from "next/link";
import { login } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setLoading(true);
    const result = await login(formData);
    setLoading(false);
    if (result?.error) {
      setError(result.error);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-stone-900 mb-1">
        Welcome back
      </h1>
      <p className="text-stone-500 text-sm mb-8">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="text-stone-700 underline underline-offset-2 hover:text-stone-900"
        >
          Sign up free
        </Link>
      </p>

      <form action={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-stone-700 text-sm">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="sara@studio.com"
            required
            autoComplete="email"
            className="bg-white border-stone-200 text-stone-900 placeholder:text-stone-400 focus-visible:ring-stone-400"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-stone-700 text-sm">
              Password
            </Label>
            <Link
              href="/forgot-password"
              className="text-stone-400 text-xs hover:text-stone-600 underline underline-offset-2"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            required
            autoComplete="current-password"
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
          className="w-full bg-stone-900 hover:bg-stone-700 text-white mt-2"
        >
          {loading ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </div>
  );
}
