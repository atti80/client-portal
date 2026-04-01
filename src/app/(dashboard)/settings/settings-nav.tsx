"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = { isOwner: boolean };

const navItems = [
  { href: "/settings", label: "Organization", ownerOnly: true },
  { href: "/settings/profile", label: "Profile", ownerOnly: false },
  { href: "/settings/members", label: "Members", ownerOnly: true },
  { href: "/settings/billing", label: "Billing", ownerOnly: true },
];

export function SettingsNav({ isOwner }: Props) {
  const pathname = usePathname();
  return (
    <nav className="w-40 shrink-0">
      <ul className="space-y-0.5">
        {navItems
          .filter((item) => !item.ownerOnly || isOwner)
          .map(({ href, label }) => {
            const active = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`block px-3 py-2 rounded-md text-sm transition-colors ${active ? "bg-secondary text-white font-medium" : "text-stone-500 hover:text-stone-900 hover:bg-stone-50"}`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
      </ul>
    </nav>
  );
}
