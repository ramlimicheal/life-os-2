"use client";

import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useState } from "react";

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const [isSaving, setIsSaving] = useState(false);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold text-white mb-8 tracking-wide">Profile Settings</h1>

      <div className="bg-[#1a1a1a] border border-[#333] rounded-xl p-8 space-y-8">
        <div className="flex items-center gap-6">
          <div className="relative">
            {user.imageUrl ? (
              <img
                src={user.imageUrl}
                alt={user.fullName || "Profile"}
                className="w-20 h-20 rounded-full object-cover border-2 border-[#333]"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-purple-600 flex items-center justify-center text-2xl font-bold">
                {user.firstName?.[0] || user.emailAddresses[0]?.emailAddress[0]?.toUpperCase()}
              </div>
            )}
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-[#252525] border border-[#333] rounded-full flex items-center justify-center hover:bg-[#333] transition-colors">
              <span className="material-symbols-outlined text-[16px]">edit</span>
            </button>
          </div>
          <div>
            <h2 className="text-lg font-medium text-white">
              {user.fullName || "User"}
            </h2>
            <p className="text-sm text-gray-500">
              {user.emailAddresses[0]?.emailAddress}
            </p>
          </div>
        </div>

        <div className="border-t border-[#333] pt-8 space-y-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Full Name</label>
            <Input
              defaultValue={user.fullName || ""}
              placeholder="Enter your name"
              className="max-w-md"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Email</label>
            <Input
              value={user.emailAddresses[0]?.emailAddress || ""}
              disabled
              className="max-w-md opacity-60"
            />
            <p className="text-xs text-gray-600 mt-1">
              Email cannot be changed here. Manage in Clerk settings.
            </p>
          </div>
        </div>

        <div className="border-t border-[#333] pt-8">
          <h3 className="text-lg font-medium text-white mb-4">Preferences</h3>
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 rounded border-[#333] bg-[#252525] text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-300">
                Enable AI-powered note categorization
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 rounded border-[#333] bg-[#252525] text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-300">
                Show grounded search sources
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-[#333] bg-[#252525] text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-300">
                Email notifications for weekly digest
              </span>
            </label>
          </div>
        </div>

        <div className="border-t border-[#333] pt-8 flex justify-end gap-4">
          <Button variant="secondary">Cancel</Button>
          <Button
            variant="primary"
            disabled={isSaving}
            onClick={() => {
              setIsSaving(true);
              setTimeout(() => setIsSaving(false), 1000);
            }}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="mt-8 bg-red-900/20 border border-red-900/50 rounded-xl p-8">
        <h3 className="text-lg font-medium text-red-400 mb-2">Danger Zone</h3>
        <p className="text-sm text-gray-400 mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <Button variant="danger">Delete Account</Button>
      </div>
    </div>
  );
}
