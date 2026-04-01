"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  Settings,
  Users,
} from "lucide-react";

type Org = { id: string; name: string; logo_url: string | null };
type Props = { org: Org; userRole: string };

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/invoices", label: "Invoices", icon: FileText },
];

const settingsItems = [
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/settings/members", label: "Members", icon: Users, ownerOnly: true },
];

export function Sidebar({ org, userRole }: Props) {
  const pathname = usePathname();
  const isOwner = userRole === "owner";

  return (
    <aside className="hidden lg:flex w-56 bg-white border-r border-stone-200 flex-col flex-shrink-0">
      <div className="h-14 flex items-center px-5 border-b border-stone-100">
        <span className="font-semibold text-stone-900 text-sm tracking-tight truncate">
          {org.name}
        </span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${
                active
                  ? "bg-secondary text-white font-medium"
                  : "text-stone-500 hover:text-stone-900 hover:bg-stone-50"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          );
        })}

        <div className="pt-4 pb-1">
          <p className="px-3 text-xs font-medium text-stone-400 uppercase tracking-wider mb-1">
            Workspace
          </p>
        </div>

        {settingsItems
          .filter((item) => !item.ownerOnly || isOwner)
          .map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${
                  active
                    ? "bg-secondary text-white font-medium"
                    : "text-stone-500 hover:text-stone-900 hover:bg-stone-50"
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </Link>
            );
          })}
      </nav>

      <div className="px-5 py-4 border-t border-stone-100">
        <p className="text-xs text-stone-400">ClientFlow</p>
      </div>
    </aside>
  );
}
