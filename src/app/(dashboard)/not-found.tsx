import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      <p className="text-5xl font-semibold text-stone-200 mb-4">404</p>
      <h2 className="text-base font-semibold text-stone-900 mb-2">
        Page not found
      </h2>
      <p className="text-sm text-stone-500 mb-6">
        This page doesn&apos;t exist or you don&apos;t have access to it.
      </p>
      <Button asChild className="bg-stone-900 hover:bg-stone-700 text-white">
        <Link href="/dashboard">Back to dashboard</Link>
      </Button>
    </div>
  );
}
