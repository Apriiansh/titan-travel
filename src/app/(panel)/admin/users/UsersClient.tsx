"use client";

import { useState, useTransition } from "react";
import { PageHeader } from "@/components/panel/PageHeader";
import { ConfirmDialog } from "@/components/panel/ConfirmDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createUser, deleteUser, updateUser, getUsers } from "@/lib/actions/users";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/lib/LocaleContext";
import { translations } from "@/lib/translations";

type User = {
  id: string;
  name: string;
  email: string;
  role: "USER" | "MANAGER" | "ADMIN";
  createdAt: Date;
};

const ROLE_BADGE: Record<string, "default" | "secondary" | "outline"> = {
  ADMIN: "default",
  MANAGER: "secondary",
  USER: "outline",
};

const emptyForm = { name: "", email: "", password: "", role: "USER" as "USER" | "MANAGER" | "ADMIN" };

export function UsersClient({ initialData }: { initialData: User[] }) {
  const [data, setData] = useState(initialData);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { dObj, locale } = useLocale();
  const t = dObj(translations).adminPanel.users;
  const common = dObj(translations).adminPanel.actions;

  const refresh = () => router.refresh();
  const f = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  }

  function openEdit(user: User) {
    setEditing(user);
    setForm({ name: user.name, email: user.email, password: "", role: user.role });
    setOpen(true);
  }

  function handleSubmit() {
    startTransition(async () => {
      if (editing) {
        await updateUser(editing.id, form);
      } else {
        await createUser(form);
      }
      setOpen(false);
      const fresh = await getUsers();
      setData(fresh as User[]);
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteUser(id);
      setData((prev) => prev.filter((u) => u.id !== id));
      refresh();
    });
  }

  return (
    <>
      <PageHeader
        title={t?.title || "Kelola Pengguna"}
        description={t?.description || "Manajemen akun admin, manajer, dan pengguna terdaftar"}
        action={
          <Button onClick={openCreate} className="bg-primary-500 hover:bg-primary-600 text-white gap-2">
            <Plus className="w-4 h-4" />
            {t?.addBtn || "Tambah Pengguna"}
          </Button>
        }
      />

      <div className="rounded-xl border border-card-border bg-card-bg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-card-border bg-card-border/20">
                <th className="text-left px-4 py-3 font-semibold text-foreground-secondary">{t?.table?.user || "Pengguna"}</th>
                <th className="text-left px-4 py-3 font-semibold text-foreground-secondary hidden sm:table-cell">{t?.table?.email || "Email"}</th>
                <th className="text-center px-4 py-3 font-semibold text-foreground-secondary">{t?.table?.role || "Role"}</th>
                <th className="text-right px-4 py-3 font-semibold text-foreground-secondary hidden md:table-cell">{t?.table?.joined || "Bergabung"}</th>
                <th className="text-center px-4 py-3 font-semibold text-foreground-secondary">{t?.table?.action || "Aksi"}</th>
              </tr>
            </thead>
            <tbody>
              {data.map((user) => (
                <tr key={user.id} className="border-b border-card-border last:border-0 hover:bg-card-border/10 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-500/10 flex items-center justify-center text-primary-500 font-bold text-sm shrink-0">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-foreground">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-foreground-secondary hidden sm:table-cell">{user.email}</td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant={ROLE_BADGE[user.role]}>{user.role}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right text-foreground-secondary hidden md:table-cell">
                    {new Date(user.createdAt).toLocaleDateString(locale === "id" ? "id-ID" : locale === "ms" ? "en-MY" : "en-US")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary-500" onClick={() => openEdit(user)}>
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <ConfirmDialog
                        trigger={
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-red-500">
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        }
                        onConfirm={() => handleDelete(user.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? (t?.form?.editTitle || "Edit Pengguna") : (t?.form?.addTitle || "Tambah Pengguna")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>{t?.form?.nameLabel || "Nama Lengkap"}</Label>
              <Input value={form.name} onChange={(e) => f("name", e.target.value)} placeholder={t?.form?.namePlaceholder || "Budi Santoso"} />
            </div>
            <div className="space-y-1.5">
              <Label>{t?.form?.emailLabel || "Email"}</Label>
              <Input type="email" value={form.email} onChange={(e) => f("email", e.target.value)} placeholder={t?.form?.emailPlaceholder || "budi@example.com"} />
            </div>
            <div className="space-y-1.5">
              <Label>{editing ? (t?.form?.passwordEditLabel || "Password Baru (kosongkan jika tidak diubah)") : (t?.form?.passwordLabel || "Password")}</Label>
              <Input type="password" value={form.password} onChange={(e) => f("password", e.target.value)} placeholder={t?.form?.passwordPlaceholder || "••••••••"} />
            </div>
            <div className="space-y-1.5">
              <Label>{t?.form?.roleLabel || "Role"}</Label>
              <Select value={form.role} onValueChange={(val) => f("role", val ?? "USER")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">USER</SelectItem>
                  <SelectItem value="MANAGER">MANAGER</SelectItem>
                  <SelectItem value="ADMIN">ADMIN</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setOpen(false)}>{common?.cancel || "Batal"}</Button>
              <Button onClick={handleSubmit} disabled={isPending} className="bg-primary-500 hover:bg-primary-600 text-white">
                {isPending && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}
                {editing ? (t?.form?.saveBtn || "Simpan") : (t?.form?.createBtn || "Buat Akun")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
