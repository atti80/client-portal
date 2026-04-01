"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { signup } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await signup(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        setSuccess(true);
      }
    });
  }

  if (success) {
    return (
      <div>
        <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center mb-6">
          <svg
            className="w-5 h-5 text-stone-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-semibold text-stone-900 mb-2">
          Check your email
        </h1>
        <p className="text-stone-500 text-sm leading-relaxed">
          We sent a verification link to your email address. Click the link to
          activate your account and get started.
        </p>
        <p className="text-stone-400 text-xs mt-6">
          Didn&apos;t receive it? Check your spam folder or{" "}
          <button
            onClick={() => setSuccess(false)}
            className="text-stone-600 underline underline-offset-2"
          >
            try again
          </button>
          .
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-stone-900 mb-1">
        Create your account
      </h1>
      <p className="text-stone-500 text-sm mb-8">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-stone-700 underline underline-offset-2 hover:text-stone-900"
        >
          Sign in
        </Link>
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
            autoComplete="name"
            className="bg-white border-stone-200 text-stone-900 placeholder:text-stone-400 focus-visible:ring-stone-400"
          />
        </div>

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
          <Label htmlFor="password" className="text-stone-700 text-sm">
            Password
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="At least 8 characters"
            required
            autoComplete="new-password"
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
          disabled={isPending}
          className="w-full bg-stone-900 hover:bg-stone-700 text-white mt-2"
        >
          {isPending ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <p className="text-stone-400 text-xs mt-6 leading-relaxed">
        By creating an account you agree to our{" "}
        <Link href="/terms" className="underline underline-offset-2">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="underline underline-offset-2">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}
