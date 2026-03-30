import { requireAuth } from "@/lib/actions/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";

export default async function BillingPage() {
  const { user, orgId } = await requireAuth();
  const adminClient = createAdminClient();

  const { data: membership } = await adminClient
    .from("memberships")
    .select("role")
    .eq("org_id", orgId)
    .eq("user_id", user.id)
    .single();

  if (membership?.role !== "owner") redirect("/settings/profile");

  const { count: memberCount } = await adminClient
    .from("memberships")
    .select("*", { count: "exact", head: true })
    .eq("org_id", orgId);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-sm font-semibold text-stone-900 mb-1">
          Current plan
        </h2>
        <p className="text-xs text-stone-500 mb-4">You are on the free plan.</p>
        <div className="bg-white border border-stone-200 rounded-lg p-5 max-w-sm">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-stone-900">Free</p>
              <p className="text-xs text-stone-500 mt-0.5">Current plan</p>
            </div>
            <span className="text-xs font-medium bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full">
              Active
            </span>
          </div>
          <div className="space-y-2 mb-5">
            {[
              { label: "Projects", value: "Unlimited" },
              { label: "Members", value: `${memberCount ?? 0} / 5` },
              { label: "Storage", value: "1 GB" },
              { label: "Invoices", value: "Unlimited" },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between">
                <p className="text-xs text-stone-500">{label}</p>
                <p className="text-xs font-medium text-stone-900">{value}</p>
              </div>
            ))}
          </div>
          <button
            disabled
            className="w-full text-sm bg-stone-900 text-white rounded-md py-2 opacity-50 cursor-not-allowed"
          >
            Upgrade to Pro — coming soon
          </button>
        </div>
      </div>
      <div>
        <h2 className="text-sm font-semibold text-stone-900 mb-1">
          What&apos;s included in Pro
        </h2>
        <div className="space-y-2 max-w-sm mt-3">
          {[
            "Unlimited team members",
            "50 GB storage",
            "Custom branding on invoices",
            "Priority support",
            "Advanced analytics",
          ].map((feature) => (
            <div key={feature} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-stone-300 shrink-0" />
              <p className="text-xs text-stone-500">{feature}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
