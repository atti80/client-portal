"use client";

import { logout } from "@/lib/actions/auth";
import { getInitials } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Props = {
  user: { full_name: string | null; avatar_url: string | null; email: string };
  orgName: string;
};

export function Topbar({ user, orgName }: Props) {
  const displayName = user.full_name || user.email;
  const initials = getInitials(displayName);

  return (
    <header className="h-14 bg-white border-b border-stone-200 flex items-center justify-between px-6 flex-shrink-0">
      <span className="lg:hidden font-semibold text-stone-900 text-sm">
        {orgName}
      </span>
      <div className="flex-1" />
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2.5 outline-none">
          <div className="w-7 h-7 rounded-full bg-stone-200 flex items-center justify-center text-stone-600 text-xs font-medium overflow-hidden">
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={displayName}
                className="w-7 h-7 object-cover"
              />
            ) : (
              initials
            )}
          </div>
          <span className="text-sm text-stone-700 hidden sm:block">
            {displayName}
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel className="font-normal">
            <p className="text-sm font-medium text-stone-900 truncate">
              {displayName}
            </p>
            <p className="text-xs text-stone-500 truncate">{user.email}</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <a href="/settings/profile" className="cursor-pointer">
              Profile settings
            </a>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <form action={logout} className="w-full">
              <button
                type="submit"
                className="w-full text-left text-red-600 text-sm"
              >
                Sign out
              </button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
