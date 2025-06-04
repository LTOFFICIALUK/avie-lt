"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { FiCamera, FiUser, FiSave, FiX } from "react-icons/fi";
import { useSession } from "@/providers/SessionProvider";
import { UserProfile } from "@/types/api";
import Platforms from "./(components)/Platforms";

type Gender = "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY";

export default function SettingsPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useSession();

  useEffect(() => {
    setProfile(user);
  }, [user]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await api.post(
        "/api/upload/user/profile-picture",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const progress = progressEvent.total
              ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
              : 0;
            setUploadProgress(progress);
          },
        }
      );

      setProfile((prev) => ({
        ...prev!,
        avatarUrl: response.data.profilePictureUrl,
      }));
    } catch (error) {
      console.error("Error uploading image:", error);
      setError("Error uploading image");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      await api.put("/api/user/profile", profile);
      router.push("/dashboard");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error saving changes");
    } finally {
      setIsSaving(false);
    }
  };

  if (!profile) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400"></div>
          <p className="text-zinc-400">Loading account settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center">
          <FiUser className="w-6 h-6 text-emerald-400 mr-3" />
          <h1 className="text-2xl font-bold text-white">Account Settings</h1>
        </div>
        <p className="text-zinc-400">
          Manage your personal information, preferences, and account security.
        </p>
      </div>

      <div className="space-y-8">
        {/* Profile Picture Section */}
        <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
          <h3 className="text-lg font-semibold text-white mb-4">Profile Picture</h3>
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-28 h-28 rounded-full overflow-hidden bg-zinc-800 border-2 border-zinc-700">
                {profile?.avatarUrl ? (
                  <Image
                    src={profile.avatarUrl}
                    alt="Profile"
                    width={112}
                    height={112}
                    className="object-cover w-full h-full"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FiUser className="w-12 h-12 text-zinc-400" />
                  </div>
                )}
              </div>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-emerald-600 hover:bg-emerald-500 transition-colors flex items-center justify-center shadow-lg"
                disabled={isUploading}
              >
                <FiCamera className="w-4 h-4 text-white" />
              </button>

              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>

            {isUploading && (
              <div className="w-full max-w-[200px] space-y-2">
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-xs text-center text-zinc-400">
                  Uploading... {uploadProgress}%
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Personal Information */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
            <h3 className="text-lg font-semibold text-white mb-6">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-300">Full Name</label>
                <input
                  type="text"
                  value={profile?.fullName || ""}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev!, fullName: e.target.value }))
                  }
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder:text-zinc-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  placeholder="Enter your full name"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-300">Display Name</label>
                <input
                  type="text"
                  value={profile?.displayName || ""}
                  disabled
                  className="w-full px-3 py-2 bg-zinc-800/50 border border-zinc-700 rounded-lg text-zinc-400 cursor-not-allowed"
                  placeholder="Display name"
                />
                <p className="text-xs text-zinc-500">Display name cannot be changed</p>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-zinc-300">Email Address</label>
                <input
                  type="email"
                  value={profile?.email || ""}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev!, email: e.target.value }))
                  }
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder:text-zinc-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  placeholder="Enter your email address"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-zinc-300">Bio</label>
                <textarea
                  value={profile?.bio || ""}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev!, bio: e.target.value }))
                  }
                  rows={3}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder:text-zinc-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-300">Date of Birth</label>
                <input
                  type="date"
                  value={profile?.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : ""}
                  onChange={(e) => {
                    setProfile((prev) => ({
                      ...prev!,
                      dateOfBirth: e.target.value ? new Date(e.target.value).toISOString() : null,
                    }));
                  }}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-300">Gender</label>
                <select
                  value={profile?.gender || ""}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev!, gender: e.target.value as Gender }))
                  }
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                >
                  <option value="">Select gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                  <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-300">Nationality</label>
                <input
                  type="text"
                  value={profile?.nationality || ""}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev!,
                      nationality: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder:text-zinc-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  placeholder="Enter your nationality"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-300">Phone Number</label>
                <input
                  type="tel"
                  value={profile?.phoneNumber || ""}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev!,
                      phoneNumber: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder:text-zinc-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-zinc-300">Address</label>
                <input
                  type="text"
                  value={profile?.address || ""}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev!, address: e.target.value }))
                  }
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder:text-zinc-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  placeholder="Enter your address"
                />
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
            <h3 className="text-lg font-semibold text-white mb-6">Preferences</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
                <label className="text-sm font-medium text-zinc-300">Email Notifications</label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profile?.preferences?.emailNotifications || false}
                    onChange={(e) =>
                      setProfile((prev) => ({
                        ...prev!,
                        preferences: {
                          ...prev!.preferences,
                          emailNotifications: e.target.checked,
                        },
                      }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
                <label className="text-sm font-medium text-zinc-300">SMS Alerts</label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profile?.preferences?.smsAlerts || false}
                    onChange={(e) =>
                      setProfile((prev) => ({
                        ...prev!,
                        preferences: {
                          ...prev!.preferences,
                          smsAlerts: e.target.checked,
                        },
                      }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Platform Connections */}
          <Platforms />

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 text-zinc-400 hover:text-white transition-colors flex items-center justify-center gap-2"
            >
              <FiX className="w-4 h-4" />
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-700 disabled:text-zinc-400 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <FiSave className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
