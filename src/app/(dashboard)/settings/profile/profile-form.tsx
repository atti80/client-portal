"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import {
  updateProfile,
  updateAvatar,
  updatePassword,
} from "@/lib/actions/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getInitials } from "@/lib/utils";

type Profile = {
  full_name: string | null;
  email: string;
  avatar_url: string | null;
};

export function ProfileForm({ profile }: { profile: Profile }) {
  const [profileLoading, setProfileLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const displayName = profile.full_name || profile.email;

  async function handleProfileSubmit(formData: FormData) {
    setProfileLoading(true);
    const result = await updateProfile(formData);
    setProfileLoading(false);
    if (result?.error) toast.error(result.error);
    else toast.success("Profile updated.");
  }

  async function handleAvatarChange(file: File) {
    const formData = new FormData();
    formData.set("avatar", file);
    setAvatarLoading(true);
    const result = await updateAvatar(formData);
    setAvatarLoading(false);
    if (result?.error) toast.error(result.error);
    else toast.success("Avatar updated.");
  }

  async function handlePasswordSubmit(formData: FormData) {
    setPasswordLoading(true);
    const result = await updatePassword(formData);
    setPasswordLoading(false);
    if (result?.error) toast.error(result.error);
    else {
      toast.success("Password updated.");
      const form = document.getElementById("password-form") as HTMLFormElement;
      form?.reset();
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-sm font-semibold text-stone-900 mb-4">Avatar</h2>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-stone-200 flex items-center justify-center text-stone-600 font-semibold text-lg overflow-hidden flex-shrink-0">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={displayName}
                className="w-16 h-16 object-cover"
              />
            ) : (
              getInitials(displayName)
            )}
          </div>
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleAvatarChange(file);
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={avatarLoading}
              onClick={() => fileInputRef.current?.click()}
              className="border-stone-200 text-stone-700 text-xs"
            >
              {avatarLoading ? "Uploading..." : "Change avatar"}
            </Button>
            <p className="text-xs text-stone-400 mt-1">PNG, JPG up to 2MB</p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-stone-900 mb-4">
          Profile details
        </h2>
        <form action={handleProfileSubmit} className="space-y-4 max-w-sm">
          <div className="space-y-1.5">
            <Label htmlFor="full_name" className="text-stone-700 text-sm">
              Full name
            </Label>
            <Input
              id="full_name"
              name="full_name"
              defaultValue={profile.full_name ?? ""}
              required
              className="bg-white border-stone-200"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-stone-700 text-sm">Email</Label>
            <Input
              value={profile.email}
              disabled
              className="bg-stone-50 border-stone-200 text-stone-400"
            />
            <p className="text-xs text-stone-400">Email cannot be changed</p>
          </div>
          <Button
            type="submit"
            disabled={profileLoading}
            className="bg-stone-900 hover:bg-stone-700 text-white"
          >
            {profileLoading ? "Saving..." : "Save changes"}
          </Button>
        </form>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-stone-900 mb-4">
          Change password
        </h2>
        <form
          id="password-form"
          action={handlePasswordSubmit}
          className="space-y-4 max-w-sm"
        >
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-stone-700 text-sm">
              New password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="At least 8 characters"
              minLength={8}
              required
              className="bg-white border-stone-200"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirm" className="text-stone-700 text-sm">
              Confirm password
            </Label>
            <Input
              id="confirm"
              name="confirm"
              type="password"
              placeholder="Repeat new password"
              required
              className="bg-white border-stone-200"
            />
          </div>
          <Button
            type="submit"
            disabled={passwordLoading}
            className="bg-stone-900 hover:bg-stone-700 text-white"
          >
            {passwordLoading ? "Updating..." : "Update password"}
          </Button>
        </form>
      </div>
    </div>
  );
}
