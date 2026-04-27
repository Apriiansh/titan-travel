"use client";

import { useState } from "react";
import { UserCircle, Lock, Save, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { updateProfile, changePassword } from "@/lib/actions/account";

type AccountUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export function AccountClient({ user }: { user: AccountUser }) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMsg(null);

    try {
      const result = await updateProfile(name, email);
      if (result.success) {
        setProfileMsg({ type: "success", text: "Profil berhasil diperbarui." });
      } else {
        setProfileMsg({ type: "error", text: result.error || "Gagal memperbarui profil." });
      }
    } catch {
      setProfileMsg({ type: "error", text: "Terjadi kesalahan. Coba lagi." });
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordMsg(null);

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: "error", text: "Konfirmasi password tidak cocok." });
      setPasswordLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMsg({ type: "error", text: "Password baru minimal 6 karakter." });
      setPasswordLoading(false);
      return;
    }

    try {
      const result = await changePassword(currentPassword, newPassword);
      if (result.success) {
        setPasswordMsg({ type: "success", text: "Password berhasil diubah." });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPasswordMsg({ type: "error", text: result.error || "Gagal mengubah password." });
      }
    } catch {
      setPasswordMsg({ type: "error", text: "Terjadi kesalahan. Coba lagi." });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Profile Card */}
      <div className="rounded-2xl border border-card-border bg-card-bg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-card-border bg-primary-500/5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-linear-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-sm">
              <span className="text-white text-lg font-bold">{initials}</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">{user.name}</h2>
              <span className="inline-block px-2 py-0.5 rounded-md bg-primary-500/10 text-primary-500 text-[10px] font-bold uppercase">
                {user.role}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleProfileSubmit} className="p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <UserCircle className="w-5 h-5 text-primary-500" />
            <h3 className="text-sm font-bold text-foreground">Edit Profil</h3>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground-secondary">Nama</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-card-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground-secondary">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-card-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all"
              required
            />
          </div>

          {profileMsg && (
            <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm ${
              profileMsg.type === "success"
                ? "bg-emerald-500/10 text-emerald-600"
                : "bg-red-500/10 text-red-500"
            }`}>
              {profileMsg.type === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              {profileMsg.text}
            </div>
          )}

          <button
            type="submit"
            disabled={profileLoading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition-colors disabled:opacity-50"
          >
            {profileLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Simpan Profil
          </button>
        </form>
      </div>

      {/* Password Card */}
      <div className="rounded-2xl border border-card-border bg-card-bg shadow-sm overflow-hidden">
        <form onSubmit={handlePasswordSubmit} className="p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Lock className="w-5 h-5 text-amber-500" />
            <h3 className="text-sm font-bold text-foreground">Ganti Password</h3>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground-secondary">Password Lama</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-card-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground-secondary">Password Baru</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-card-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
              required
              minLength={6}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground-secondary">Konfirmasi Password Baru</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-card-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
              required
              minLength={6}
            />
          </div>

          {passwordMsg && (
            <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm ${
              passwordMsg.type === "success"
                ? "bg-emerald-500/10 text-emerald-600"
                : "bg-red-500/10 text-red-500"
            }`}>
              {passwordMsg.type === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              {passwordMsg.text}
            </div>
          )}

          <button
            type="submit"
            disabled={passwordLoading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-white text-sm font-semibold hover:bg-amber-600 transition-colors disabled:opacity-50"
          >
            {passwordLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
            Ubah Password
          </button>
        </form>
      </div>
    </div>
  );
}
