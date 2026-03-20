import { useState, useRef } from "react";
import { Loader2, User, Camera } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ROLE_BADGE_VARIANT } from "../constants";

/**
 * Student (and all roles) profile page.
 * Allows updating name, bio, and password.
 */
const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef(null);
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || "");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
  });
  const [pwForm, setPwForm] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [saving, setSaving] = useState(false);
  const [savingPw, setSavingPw] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");
  const [pwMsg, setPwMsg] = useState("");
  const [profileErr, setProfileErr] = useState("");
  const [pwErr, setPwErr] = useState("");

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const { data } = await api.post("/upload/avatar", formData);
      setAvatarUrl(data.url);
      // Save avatar URL to profile
      await api.put(`/users/${user._id}`, { avatar: data.url });
      updateUser({ avatar: data.url });
    } catch (err) {
      setProfileErr(err.response?.data?.error || "Avatar upload failed");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileErr("");
    setProfileMsg("");
    setSaving(true);
    try {
      await api.put(`/users/${user._id}`, { name: form.name, bio: form.bio });
      updateUser({ name: form.name, bio: form.bio });
      setProfileMsg("Profile updated successfully.");
    } catch (err) {
      setProfileErr(err.response?.data?.error || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    setPwErr("");
    setPwMsg("");
    if (pwForm.newPassword.length < 6) {
      setPwErr("New password must be at least 6 characters.");
      return;
    }
    setSavingPw(true);
    try {
      await api.put(`/users/${user._id}/password`, pwForm);
      setPwMsg("Password updated successfully.");
      setPwForm({ currentPassword: "", newPassword: "" });
    } catch (err) {
      setPwErr(err.response?.data?.error || "Failed to update password");
    } finally {
      setSavingPw(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Profile</h1>

      {/* Avatar + role */}
      <Card className="mb-6">
        <CardContent className="flex items-center gap-5 pt-6">
          <div className="relative">
            <Avatar className="h-16 w-16 text-xl">
              <AvatarImage src={avatarUrl} alt={user?.name} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingAvatar}
              className="absolute -bottom-1 -right-1 w-6 h-6 bg-violet-600 rounded-full flex items-center justify-center text-white hover:bg-violet-700 transition-colors"
            >
              {uploadingAvatar ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Camera className="w-3 h-3" />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900">{user?.name}</p>
            <p className="text-sm text-gray-500 mb-2">{user?.email}</p>
            <Badge variant={ROLE_BADGE_VARIANT[user?.role] || "secondary"}>
              {user?.role}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Profile form */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <User className="w-4 h-4" /> Personal Info
          </CardTitle>
        </CardHeader>
        <CardContent>
          {profileMsg && (
            <p className="text-green-600 text-sm bg-green-50 rounded-lg px-4 py-3 mb-4">
              {profileMsg}
            </p>
          )}
          {profileErr && (
            <p className="text-red-600 text-sm bg-red-50 rounded-lg px-4 py-3 mb-4">
              {profileErr}
            </p>
          )}
          <form onSubmit={handleProfileSave} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="bio">Bio</Label>
              <textarea
                id="bio"
                value={form.bio}
                onChange={(e) =>
                  setForm((f) => ({ ...f, bio: e.target.value }))
                }
                rows={3}
                placeholder="Tell us a bit about yourself..."
                className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 resize-none"
              />
            </div>
            <Button type="submit" disabled={saving} className="self-start">
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Password form */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          {pwMsg && (
            <p className="text-green-600 text-sm bg-green-50 rounded-lg px-4 py-3 mb-4">
              {pwMsg}
            </p>
          )}
          {pwErr && (
            <p className="text-red-600 text-sm bg-red-50 rounded-lg px-4 py-3 mb-4">
              {pwErr}
            </p>
          )}
          <form onSubmit={handlePasswordSave} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={pwForm.currentPassword}
                onChange={(e) =>
                  setPwForm((f) => ({ ...f, currentPassword: e.target.value }))
                }
                required
                placeholder="••••••••"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={pwForm.newPassword}
                onChange={(e) =>
                  setPwForm((f) => ({ ...f, newPassword: e.target.value }))
                }
                required
                minLength={6}
                placeholder="Min. 6 characters"
              />
            </div>
            <Button type="submit" disabled={savingPw} className="self-start">
              {savingPw ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Updating...
                </>
              ) : (
                "Update Password"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
