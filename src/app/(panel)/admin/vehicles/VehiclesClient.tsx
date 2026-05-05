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
import { Switch } from "@/components/ui/switch";
import {
  createVehicleType,
  deleteVehicleType,
  getVehicleTypes,
  updateVehicleType,
} from "@/lib/actions/vehicle-types";
import { Bus, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useLocale } from "@/lib/LocaleContext";
import { translations } from "@/lib/translations";

type VehicleType = {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: Date;
};

const emptyForm = { name: "", isActive: true };

export function VehiclesClient({ initialData }: { initialData: VehicleType[] }) {
  const [data, setData] = useState(initialData);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<VehicleType | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [isPending, startTransition] = useTransition();
  const { dObj, locale } = useLocale();
  const t = dObj(translations).adminPanel.vehicles;

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  }

  function openEdit(vehicle: VehicleType) {
    setEditing(vehicle);
    setForm({ name: vehicle.name, isActive: vehicle.isActive });
    setOpen(true);
  }

  function handleSubmit() {
    startTransition(async () => {
      if (editing) {
        await updateVehicleType(editing.id, { name: form.name, isActive: form.isActive });
      } else {
        await createVehicleType(form.name);
      }
      setOpen(false);
      const fresh = await getVehicleTypes();
      setData(fresh as VehicleType[]);
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteVehicleType(id);
      setData((prev) => prev.filter((v) => v.id !== id));
    });
  }

  return (
    <>
      <PageHeader
        title={t?.title || "Tipe Kendaraan"}
        description={t?.description || "Kelola jenis kendaraan yang tersedia untuk paket wisata"}
        action={
          <Button
            onClick={openCreate}
            className="bg-primary-500 hover:bg-primary-600 text-white gap-2"
          >
            <Plus className="w-4 h-4" />
            {t?.addBtn || "Tambah Kendaraan"}
          </Button>
        }
      />

      <div className="rounded-xl border border-card-border bg-card-bg shadow-sm overflow-hidden">
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-foreground-secondary">
            <Bus className="w-10 h-10 mb-3 opacity-30" />
            <p className="text-sm">{t?.empty || "Belum ada tipe kendaraan"}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-card-border bg-card-border/20">
                  <th className="text-left px-4 py-3 font-semibold text-foreground-secondary">
                    {t?.table?.name || "Nama Kendaraan"}
                  </th>
                  <th className="text-center px-4 py-3 font-semibold text-foreground-secondary">
                    {t?.table?.status || "Status"}
                  </th>
                  <th className="text-right px-4 py-3 font-semibold text-foreground-secondary hidden md:table-cell">
                    {t?.table?.created || "Dibuat"}
                  </th>
                  <th className="text-center px-4 py-3 font-semibold text-foreground-secondary">
                    {t?.table?.action || "Aksi"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((vehicle) => (
                  <tr
                    key={vehicle.id}
                    className="border-b border-card-border last:border-0 hover:bg-card-border/10 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center shrink-0">
                          <Bus className="w-4 h-4 text-primary-500" />
                        </div>
                        <span className="font-medium text-foreground">
                          {vehicle.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge
                        variant={vehicle.isActive ? "default" : "secondary"}
                        className={
                          vehicle.isActive
                            ? "bg-green-100 text-green-700 hover:bg-green-100 border-none"
                            : "bg-slate-100 text-slate-500 hover:bg-slate-100 border-none"
                        }
                      >
                        {vehicle.isActive 
                          ? (dObj(translations).adminPanel.packages.status.active || "Aktif")
                          : (dObj(translations).adminPanel.packages.status.inactive || "Nonaktif")
                        }
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right text-foreground-secondary hidden md:table-cell">
                      {new Date(vehicle.createdAt).toLocaleDateString(locale === "id" ? "id-ID" : locale === "ms" ? "en-MY" : "en-US")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:text-primary-500"
                          onClick={() => openEdit(vehicle)}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <ConfirmDialog
                          trigger={
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:text-red-500"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          }
                          onConfirm={() => handleDelete(vehicle.id)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {editing ? (t?.form?.editTitle || "Edit Kendaraan") : (t?.form?.addTitle || "Tambah Kendaraan")}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>{t?.form?.nameLabel || "Nama Kendaraan"}</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder={t?.form?.namePlaceholder || "Cth: Bus, Hiace, ELF, Pesawat"}
              />
            </div>
            {editing && (
              <div className="flex items-center justify-between p-3 rounded-lg border border-card-border">
                <Label className="text-sm font-medium cursor-pointer">{t?.form?.activeLabel || "Aktif"}</Label>
                <Switch
                  checked={form.isActive}
                  onCheckedChange={(val) =>
                    setForm((prev) => ({ ...prev, isActive: val }))
                  }
                />
              </div>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                {dObj(translations).adminPanel.actions.cancel || "Batal"}
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isPending || !form.name.trim()}
                className="bg-primary-500 hover:bg-primary-600 text-white"
              >
                {isPending && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}
                {editing 
                  ? (dObj(translations).adminPanel.actions.save || "Simpan") 
                  : (dObj(translations).adminPanel.actions.addNew || "Tambah")
                }
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
