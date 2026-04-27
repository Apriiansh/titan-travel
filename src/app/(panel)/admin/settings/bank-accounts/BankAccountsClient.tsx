"use client";

import { useState, useTransition } from "react";
import { PageHeader } from "@/components/panel/PageHeader";
import { FormCard } from "@/components/panel/FormCard";
import { ImageUpload } from "@/components/panel/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Landmark,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  GripVertical,
} from "lucide-react";
import {
  getBankAccounts,
  createBankAccount,
  updateBankAccount,
  deleteBankAccount,
} from "@/lib/actions/bank-accounts";
import { useRouter } from "next/navigation";

type BankAccount = {
  id: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  imageUrl: string | null;
  isActive: boolean;
  sortOrder: number;
};

type FormData = {
  bankName: string;
  accountName: string;
  accountNumber: string;
  imageUrl: string;
  isActive: boolean;
  sortOrder: number;
};

const emptyForm: FormData = {
  bankName: "",
  accountName: "",
  accountNumber: "",
  imageUrl: "",
  isActive: true,
  sortOrder: 0,
};

export function BankAccountsClient({
  initialAccounts,
}: {
  initialAccounts: BankAccount[];
}) {
  const [accounts, setAccounts] = useState(initialAccounts);
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const openCreate = () => {
    setEditId(null);
    setForm({ ...emptyForm, sortOrder: accounts.length });
    setIsOpen(true);
  };

  const openEdit = (account: BankAccount) => {
    setEditId(account.id);
    setForm({
      bankName: account.bankName,
      accountName: account.accountName,
      accountNumber: account.accountNumber,
      imageUrl: account.imageUrl || "",
      isActive: account.isActive,
      sortOrder: account.sortOrder,
    });
    setIsOpen(true);
  };

  const handleSave = () => {
    if (!form.bankName || !form.accountName || !form.accountNumber) return;

    startTransition(async () => {
      if (editId) {
        await updateBankAccount(editId, {
          bankName: form.bankName,
          accountName: form.accountName,
          accountNumber: form.accountNumber,
          imageUrl: form.imageUrl || null,
          isActive: form.isActive,
          sortOrder: form.sortOrder,
        });
      } else {
        await createBankAccount({
          bankName: form.bankName,
          accountName: form.accountName,
          accountNumber: form.accountNumber,
          imageUrl: form.imageUrl || undefined,
          sortOrder: form.sortOrder,
        });
      }
      setIsOpen(false);
      const fresh = await getBankAccounts();
      setAccounts(JSON.parse(JSON.stringify(fresh)));
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Hapus rekening ini?")) return;
    startTransition(async () => {
      await deleteBankAccount(id);
      setAccounts((prev) => prev.filter((a) => a.id !== id));
      router.refresh();
    });
  };

  const handleToggleActive = (account: BankAccount) => {
    startTransition(async () => {
      await updateBankAccount(account.id, { isActive: !account.isActive });
      setAccounts((prev) =>
        prev.map((a) =>
          a.id === account.id ? { ...a, isActive: !a.isActive } : a
        )
      );
    });
  };

  return (
    <>
      <PageHeader
        title="Rekening Bank"
        description="Kelola rekening bank yang ditampilkan ke pelanggan saat pembayaran"
        action={
          <Button
            onClick={openCreate}
            className="bg-primary-500 hover:bg-primary-600 text-white rounded-lg h-10 px-5 gap-2 font-bold text-sm"
          >
            <Plus className="w-4 h-4" />
            Tambah Rekening
          </Button>
        }
      />

      <div className="space-y-4">
        {accounts.length === 0 ? (
          <FormCard>
            <div className="text-center py-12 text-foreground-secondary">
              <Landmark className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="font-semibold">Belum ada rekening bank</p>
              <p className="text-sm mt-1">
                Tambahkan rekening agar pelanggan bisa melakukan transfer
                pembayaran.
              </p>
            </div>
          </FormCard>
        ) : (
          accounts.map((account) => (
            <FormCard key={account.id} className="p-4!">
              <div className="flex items-center gap-4">
                <GripVertical className="w-4 h-4 text-foreground-secondary/40 shrink-0" />

                {account.imageUrl ? (
                  <div className="w-14 h-14 rounded-lg border border-card-border overflow-hidden shrink-0 relative">
                    <img
                      src={account.imageUrl}
                      alt={account.bankName}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-lg bg-primary-500/10 flex items-center justify-center shrink-0">
                    <Landmark className="w-6 h-6 text-primary-500" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-foreground truncate">
                      {account.bankName}
                    </p>
                    {!account.isActive && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-red-600 font-bold uppercase">
                        Nonaktif
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-mono text-foreground-secondary mt-0.5">
                    {account.accountNumber}
                  </p>
                  <p className="text-xs text-foreground-secondary">
                    a.n. {account.accountName}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Switch
                    checked={account.isActive}
                    onCheckedChange={() => handleToggleActive(account)}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 w-9 p-0 rounded-lg"
                    onClick={() => openEdit(account)}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 w-9 p-0 rounded-lg text-red-500 hover:bg-red-50 hover:border-red-200"
                    onClick={() => handleDelete(account.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </FormCard>
          ))
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              {editId ? "Edit Rekening" : "Tambah Rekening Baru"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase text-foreground-secondary">
                Nama Bank
              </Label>
              <Input
                value={form.bankName}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, bankName: e.target.value }))
                }
                placeholder="Bank Mandiri / BCA / QRIS"
                className="h-10 rounded-lg"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase text-foreground-secondary">
                Nomor Rekening
              </Label>
              <Input
                value={form.accountNumber}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    accountNumber: e.target.value,
                  }))
                }
                placeholder="113-00-1394650-8"
                className="h-10 rounded-lg font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase text-foreground-secondary">
                Nama Pemilik Rekening
              </Label>
              <Input
                value={form.accountName}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, accountName: e.target.value }))
                }
                placeholder="CV TITAN JAYA TRAVELINDO"
                className="h-10 rounded-lg"
              />
            </div>

            <ImageUpload
              label="Gambar / QRIS (Opsional)"
              helperText="Upload foto QRIS atau logo bank"
              value={form.imageUrl}
              onChange={(url) =>
                setForm((prev) => ({
                  ...prev,
                  imageUrl: Array.isArray(url) ? url[0] : url,
                }))
              }
            />

            <div className="flex items-center justify-between pt-2">
              <div>
                <Label className="text-sm font-semibold">Aktif</Label>
                <p className="text-xs text-foreground-secondary">
                  Tampilkan ke pelanggan saat pembayaran
                </p>
              </div>
              <Switch
                checked={form.isActive}
                onCheckedChange={(checked) =>
                  setForm((prev) => ({ ...prev, isActive: checked }))
                }
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-card-border">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="rounded-lg h-10 px-5"
              >
                Batal
              </Button>
              <Button
                onClick={handleSave}
                disabled={
                  isPending ||
                  !form.bankName ||
                  !form.accountName ||
                  !form.accountNumber
                }
                className="bg-primary-500 hover:bg-primary-600 text-white rounded-lg h-10 px-5 gap-2 font-bold"
              >
                {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                {editId ? "Simpan Perubahan" : "Tambah Rekening"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
