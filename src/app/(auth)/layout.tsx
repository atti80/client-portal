import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ClientFlow — Sign in",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-stone-50 flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-stone-900 flex-col justify-between p-12">
        <div>
          <span className="text-white font-semibold text-xl tracking-tight">
            ClientFlow
          </span>
        </div>
        <div>
          <blockquote className="text-stone-300 text-lg leading-relaxed font-light">
            &quot;Managing clients used to mean juggling emails, spreadsheets,
            and Dropbox links. Now everything is in one place.&quot;
          </blockquote>
          <div className="mt-6">
            <p className="text-white font-medium text-sm">Sara Kovač</p>
            <p className="text-stone-500 text-sm">Brand designer, freelance</p>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="w-1 h-1 rounded-full bg-stone-600" />
          <div className="w-1 h-1 rounded-full bg-stone-600" />
          <div className="w-1 h-1 rounded-full bg-stone-400" />
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8">
            <span className="text-stone-900 font-semibold text-xl tracking-tight">
              ClientFlow
            </span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
