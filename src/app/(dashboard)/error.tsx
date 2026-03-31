"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <div className="flex flex-col items-center justify-center min-h-100 text-center">
      <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center mb-4">
        <span className="text-red-500 text-lg">!</span>
      </div>
      <h2 className="text-base font-semibold text-stone-900 mb-2">
        Something went wrong
      </h2>
      <p className="text-sm text-stone-500 mb-6 max-w-sm">
        An unexpected error occurred. Try refreshing the page or contact support
        if the problem persists.
      </p>
      <Button
        onClick={reset}
        variant="outline"
        className="border-stone-200 text-stone-700"
      >
        Try again
      </Button>
    </div>
  );
}
