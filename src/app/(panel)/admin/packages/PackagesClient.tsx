"use client";

import { useState, useTransition, useEffect } from "react";
import { PageHeader } from "@/components/panel/PageHeader";
import { Button } from "@/components/ui/button";
import {
  createPackage,
  deletePackage,
  togglePackagePublish,
  updatePackage,
} from "@/lib/actions/packages";
import { translateToAll } from "@/lib/actions/translate";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Package, PackageFormState } from "./types";
import { PackageTable } from "./components/PackageTable";
import { PackageDialog } from "./components/PackageDialog";

const emptyForm: PackageFormState = {
  titleId: "",
  titleEn: "",
  titleMs: "",
  descId: "",
  descEn: "",
  descMs: "",
  locationId: "",
  locationEn: "",
  locationMs: "",
  durationId: "",
  durationEn: "",
  durationMs: "",
  capacity: 10,
  facilityScore: 3,
  departureScore: 1,
  durationDays: 1,
  rating: 0,
  reviews: 0,
  images: [],
  isPublished: false,
  priceTiers: [],
};

type VehicleType = { id: string; name: string };

interface PackagesClientProps {
  initialPackages: Package[];
  vehicleTypes: VehicleType[];
}

export function PackagesClient({ initialPackages, vehicleTypes }: PackagesClientProps) {
  const [packages, setPackages] = useState<Package[]>(initialPackages);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Package | null>(null);
  const [form, setForm] = useState<PackageFormState>(emptyForm);
  const [isPending, startTransition] = useTransition();
  const [isTranslating, setIsTranslating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setPackages(initialPackages);
  }, [initialPackages]);

  const refresh = () => router.refresh();

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  }

  function openEdit(pkg: Package) {
    setEditing(pkg);
    const desc = pkg.description;
    setForm({
      titleId: pkg.title.id,
      titleEn: pkg.title.en,
      titleMs: pkg.title.ms || pkg.title.en,
      descId: desc?.id ?? "",
      descEn: desc?.en ?? "",
      descMs: desc?.ms ?? desc?.en ?? "",
      locationId: pkg.location.id,
      locationEn: pkg.location.en,
      locationMs: pkg.location.ms || pkg.location.en,
      durationId: pkg.duration.id,
      durationEn: pkg.duration.en,
      durationMs: pkg.duration.ms || pkg.duration.en,
      capacity: pkg.capacity || 0,
      facilityScore: pkg.facilityScore,
      departureScore: pkg.departureScore,
      durationDays: pkg.durationDays,
      rating: pkg.rating || 0,
      reviews: pkg.reviews || 0,
      images: pkg.images || [],
      isPublished: pkg.isPublished,
      priceTiers: (pkg.priceTiers || []).map((t) => ({
        minPax: t.minPax,
        maxPax: t.maxPax,
        price: String(t.price),
        originalPrice: t.originalPrice ? String(t.originalPrice) : "",
        vehicleTypeId: t.vehicleTypeId ?? "",
      })),
    });
    setOpen(true);
  }

  async function handleAutoTranslate() {
    if (!form.titleEn) return;
    setIsTranslating(true);
    try {
      const [titleTrans, locationTrans, durationTrans, descTrans] =
        await Promise.all([
          translateToAll(form.titleEn),
          form.locationEn
            ? translateToAll(form.locationEn)
            : Promise.resolve({ id: "", ms: "" }),
          form.durationEn
            ? translateToAll(form.durationEn)
            : Promise.resolve({ id: "", ms: "" }),
          form.descEn
            ? translateToAll(form.descEn)
            : Promise.resolve({ id: "", ms: "" }),
        ]);

      setForm((prev) => ({
        ...prev,
        titleId: titleTrans.id || prev.titleId,
        titleMs: titleTrans.ms || prev.titleMs,
        locationId: locationTrans.id || prev.locationId,
        locationMs: locationTrans.ms || prev.locationMs,
        durationId: durationTrans.id || prev.durationId,
        durationMs: durationTrans.ms || prev.durationMs,
        descId: descTrans.id || prev.descId,
        descMs: descTrans.ms || prev.descMs,
      }));
    } catch (err) {
      console.error("Translation failed:", err);
    } finally {
      setIsTranslating(false);
    }
  }

  function handleSubmit() {
    const payload = {
      ...form,
      capacity: Number(form.capacity),
      priceTiers: form.priceTiers.map((t) => ({
        minPax: Number(t.minPax),
        maxPax: Number(t.maxPax),
        price: Number(t.price),
        originalPrice: t.originalPrice ? Number(t.originalPrice) : undefined,
        vehicleTypeId: t.vehicleTypeId || null,
      })),
    };

    startTransition(async () => {
      if (editing) {
        await updatePackage(editing.id, payload);
      } else {
        await createPackage(payload);
      }
      setOpen(false);
      refresh();
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deletePackage(id);
      setPackages((prev) => prev.filter((p) => p.id !== id));
      refresh();
    });
  }

  function handleTogglePublish(id: string, current: boolean) {
    startTransition(async () => {
      await togglePackagePublish(id, !current);
      refresh();
    });
  }

  const f = (field: string, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  function addTier() {
    f("priceTiers", [
      ...form.priceTiers,
      { minPax: 1, maxPax: 99, price: "", originalPrice: "", vehicleTypeId: "" },
    ]);
  }

  function removeTier(index: number) {
    f(
      "priceTiers",
      form.priceTiers.filter((_, i) => i !== index),
    );
  }

  function updateTier(index: number, field: string, value: string) {
    const newTiers = [...form.priceTiers];
    const tier = { ...newTiers[index], [field]: value };

    if (field === "price" && value.startsWith("%")) {
      const originalPrice = Number(tier.originalPrice);
      if (originalPrice > 0) {
        const percent = parseFloat(value.replace("%", ""));
        if (!isNaN(percent)) {
          const discountedPrice = Math.round(
            originalPrice - (originalPrice * percent) / 100,
          );
          tier.price = discountedPrice.toString();
        }
      }
    }

    newTiers[index] = tier;
    f("priceTiers", newTiers);
  }

  return (
    <>
      <PageHeader
        title="Paket Wisata"
        description="Kelola paket perjalanan dengan rincian dalam 3 bahasa (ID, EN, MS)"
        action={
          <Button
            onClick={openCreate}
            className="bg-primary-500 hover:bg-primary-600 text-white gap-2 rounded-md shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Tambah Paket
          </Button>
        }
      />

      <PackageTable
        packages={packages}
        onEdit={openEdit}
        onDelete={handleDelete}
        onTogglePublish={handleTogglePublish}
        isPending={isPending}
      />

      <PackageDialog
        open={open}
        onOpenChange={setOpen}
        editing={!!editing}
        isPending={isPending}
        form={form}
        isTranslating={isTranslating}
        vehicleTypes={vehicleTypes}
        onFieldChange={f}
        onAutoTranslate={handleAutoTranslate}
        onAddTier={addTier}
        onRemoveTier={removeTier}
        onUpdateTier={updateTier}
        onSubmit={handleSubmit}
      />
    </>
  );
}
