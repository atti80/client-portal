"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { addProjectMember, removeProjectMember } from "@/lib/actions/projects";
import { getInitials } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { MemberRole } from "@/lib/types/database.types";

type ProjectMember = {
  role: string;
  users: {
    id: string;
    full_name: string | null;
    email: string;
    avatar_url: string | null;
  } | null;
};

type OrgMember = {
  user_id: string;
  role: string;
  users: {
    id: string;
    full_name: string | null;
    email: string;
    avatar_url: string | null;
  } | null;
};

type Props = {
  projectId: string;
  members: ProjectMember[];
  availableMembers: OrgMember[];
  currentUserId: string;
  isOwner: boolean;
};

export function ProjectTeam({
  projectId,
  members,
  availableMembers,
  currentUserId,
  isOwner,
}: Props) {
  const [showAdd, setShowAdd] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<"member" | "client">(
    "member"
  );
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleAdd() {
    if (!selectedUserId) return;
    setLoading(true);
    const result = await addProjectMember(
      projectId,
      selectedUserId,
      selectedRole as MemberRole
    );
    setLoading(false);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Member added.");
      setShowAdd(false);
      setSelectedUserId("");
      setSelectedRole("member");
      router.refresh();
    }
  }

  async function handleRemove(userId: string, name: string) {
    if (!confirm(`Remove ${name} from this project?`)) return;
    const result = await removeProjectMember(projectId, userId);
    if (result?.error) toast.error(result.error);
    else {
      toast.success("Member removed.");
      router.refresh();
    }
  }

  return (
    <div>
      <p className="text-xs font-medium text-stone-500 uppercase tracking-wider mb-3">
        Team
      </p>

      <div className="flex flex-wrap gap-2">
        {members.map((m) => {
          const u = m.users;
          if (!u) return null;
          const name = u.full_name || u.email;
          const isCurrentUser = u.id === currentUserId;
          const isProjectOwner = m.role === "owner";
          const canRemove = isOwner && !isProjectOwner && !isCurrentUser;
          return (
            <div
              key={u.id}
              className="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-full pl-2 pr-3 py-1 group"
            >
              <div className="w-5 h-5 rounded-full bg-stone-200 flex items-center justify-center text-stone-600 text-xs font-medium overflow-hidden flex-shrink-0">
                {u.avatar_url ? (
                  <img
                    src={u.avatar_url}
                    alt={name}
                    className="w-5 h-5 object-cover"
                  />
                ) : (
                  getInitials(name)
                )}
              </div>
              <span className="text-xs text-stone-700">{name}</span>
              <span className="text-xs text-stone-400">{m.role}</span>
              {canRemove && (
                <button
                  onClick={() => handleRemove(u.id, name)}
                  className="text-stone-300 hover:text-red-500 transition-colors ml-0.5 leading-none"
                  title="Remove from project"
                >
                  ×
                </button>
              )}
            </div>
          );
        })}

        {isOwner && availableMembers.length > 0 && !showAdd && (
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-1.5 bg-stone-50 border border-dashed border-stone-300 hover:border-stone-400 hover:bg-stone-100 rounded-full px-3 py-1 text-xs text-stone-500 hover:text-stone-700 transition-colors"
          >
            <span className="text-base leading-none mb-0.5">+</span>
            Add member
          </button>
        )}
      </div>

      {showAdd && (
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          <Select value={selectedUserId} onValueChange={setSelectedUserId}>
            <SelectTrigger className="w-48 h-8 text-xs border-stone-200 bg-white">
              <SelectValue placeholder="Select member" />
            </SelectTrigger>
            <SelectContent>
              {availableMembers.map((m) => {
                const u = m.users;
                if (!u) return null;
                return (
                  <SelectItem key={u.id} value={u.id} className="text-xs">
                    {u.full_name || u.email}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          <Select
            value={selectedRole}
            onValueChange={(v) => setSelectedRole(v as "member" | "client")}
          >
            <SelectTrigger className="w-28 h-8 text-xs border-stone-200 bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="member" className="text-xs">
                Member
              </SelectItem>
              <SelectItem value="client" className="text-xs">
                Client
              </SelectItem>
            </SelectContent>
          </Select>

          <Button
            size="sm"
            disabled={!selectedUserId || loading}
            onClick={handleAdd}
            className="h-8 text-xs bg-stone-900 hover:bg-stone-700 text-white"
          >
            {loading ? "Adding..." : "Add"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setShowAdd(false);
              setSelectedUserId("");
            }}
            className="h-8 text-xs border-stone-200 text-stone-600"
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}
