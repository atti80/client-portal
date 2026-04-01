"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  inviteMember,
  removeMember,
  cancelInvitation,
  updateMemberRole,
} from "@/lib/actions/members";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDate, getInitials } from "@/lib/utils";
import { useRouter } from "next/navigation";

type Member = {
  id: string;
  role: string;
  joined_at: string;
  users: {
    id: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
  };
};

type Invitation = {
  id: string;
  email: string;
  role: string;
  created_at: string;
  expires_at: string;
};

type Props = {
  currentUserId: string;
  members: Member[];
  invitations: Invitation[];
};

const roleBadgeStyles: Record<string, string> = {
  owner: "bg-stone-900 text-white",
  member: "bg-stone-100 text-stone-700",
  client: "bg-blue-50 text-blue-700",
};

export function MembersClient({ currentUserId, members, invitations }: Props) {
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<"member" | "client">("member");
  const router = useRouter();

  const currentUserRole = members.find(
    (m) => m.users.id === currentUserId
  )?.role;
  const isOwner = currentUserRole === "owner";

  async function handleInvite(formData: FormData) {
    formData.set("role", role);
    setLoading(true);
    const result = await inviteMember(formData);
    setLoading(false);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Invitation sent successfully.");
    }
  }

  async function handleRemove(userId: string, name: string) {
    if (!confirm(`Remove ${name} from the workspace?`)) return;
    const result = await removeMember(userId);
    if (result?.error) toast.error(result.error);
    else {
      toast.success("Member removed.");
      router.refresh();
    }
  }

  async function handleRoleChange(userId: string, newRole: string) {
    const result = await updateMemberRole(
      userId,
      newRole as "member" | "client"
    );
    if (result?.error) toast.error(result.error);
    else toast.success("Role updated.");
  }

  async function handleCancelInvite(invitationId: string, email: string) {
    if (!confirm(`Cancel invitation for ${email}?`)) return;
    const result = await cancelInvitation(invitationId);
    if (result?.error) toast.error(result.error);
    else toast.success("Invitation cancelled.");
  }

  return (
    <div className="max-w-2xl space-y-10">
      {isOwner && (
        <div>
          <h2 className="text-base font-semibold text-stone-900 mb-1">
            Invite someone
          </h2>
          <p className="text-stone-500 text-sm mb-4">
            They&apos;ll receive an email with a link to join your workspace.
          </p>
          <form action={handleInvite} className="flex gap-3 items-end">
            <div className="flex-1 space-y-1.5">
              <Label htmlFor="email" className="text-stone-700 text-sm">
                Email address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="client@company.com"
                required
                className="bg-white border-stone-200"
              />
            </div>
            <div className="w-36 space-y-1.5">
              <Label className="text-stone-700 text-sm">Role</Label>
              <Select
                value={role}
                onValueChange={(v) => setRole(v as "member" | "client")}
              >
                <SelectTrigger className="bg-white border-stone-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="client">Client</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              {loading ? "Sending..." : "Send invite"}
            </Button>
          </form>
        </div>
      )}

      <div>
        <h2 className="text-base font-semibold text-stone-900 mb-4">
          Members ({members.length})
        </h2>
        <div className="divide-y divide-stone-100 border border-stone-200 rounded-lg overflow-hidden">
          {members.map((member) => {
            const isCurrentUser = member.users.id === currentUserId;
            const isOwnerRow = member.role === "owner";
            const displayName = member.users.full_name || member.users.email;
            return (
              <div
                key={member.id}
                className="flex items-center gap-3 px-4 py-3 bg-white"
              >
                <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center text-stone-600 text-xs font-medium shrink-0">
                  {member.users.avatar_url ? (
                    <img
                      src={member.users.avatar_url}
                      alt={displayName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    getInitials(displayName)
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-stone-900 truncate">
                    {displayName}
                    {isCurrentUser && (
                      <span className="text-stone-400 font-normal ml-1">
                        (you)
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-stone-400 truncate">
                    {member.users.email}
                  </p>
                </div>
                {isOwner && !isOwnerRow && !isCurrentUser ? (
                  <Select
                    defaultValue={member.role}
                    onValueChange={(v) => handleRoleChange(member.users.id, v)}
                  >
                    <SelectTrigger className="w-28 h-7 text-xs border-stone-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="member">Member</SelectItem>
                      <SelectItem value="client">Client</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${roleBadgeStyles[member.role]}`}
                  >
                    {member.role}
                  </span>
                )}
                {isOwner && !isOwnerRow && !isCurrentUser && (
                  <button
                    onClick={() => handleRemove(member.users.id, displayName)}
                    className="text-xs text-stone-400 hover:text-red-600 transition-colors ml-2"
                  >
                    Remove
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {invitations.length > 0 && (
        <div>
          <h2 className="text-base font-semibold text-stone-900 mb-4">
            Pending invitations ({invitations.length})
          </h2>
          <div className="divide-y divide-stone-100 border border-stone-200 rounded-lg overflow-hidden">
            {invitations.map((invitation) => (
              <div
                key={invitation.id}
                className="flex items-center gap-3 px-4 py-3 bg-white"
              >
                <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 text-xs shrink-0">
                  ?
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-stone-900 truncate">
                    {invitation.email}
                  </p>
                  <p className="text-xs text-stone-400">
                    Invited {formatDate(invitation.created_at)} · Expires{" "}
                    {formatDate(invitation.expires_at)}
                  </p>
                </div>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${roleBadgeStyles[invitation.role]}`}
                >
                  {invitation.role}
                </span>
                {isOwner && (
                  <button
                    onClick={() =>
                      handleCancelInvite(invitation.id, invitation.email)
                    }
                    className="text-xs text-stone-400 hover:text-red-600 transition-colors ml-2"
                  >
                    Cancel
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
