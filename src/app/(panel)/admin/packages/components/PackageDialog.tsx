"use client";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tag, Loader2, CheckCircle } from "lucide-react";
import { PackageForm } from "./PackageForm";
import { PackageFormState } from "../types";

type VehicleType = { id: string; name: string };

interface PackageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: boolean;
  isPending: boolean;
  form: PackageFormState;
  isTranslating: boolean;
  vehicleTypes: VehicleType[];
  onFieldChange: (field: string, value: any) => void;
  onAutoTranslate: () => void;
  onAddTier: () => void;
  onRemoveTier: (index: number) => void;
  onUpdateTier: (index: number, field: string, value: string) => void;
  onSubmit: () => void;
}

export function PackageDialog({
  open,
  onOpenChange,
  editing,
  isPending,
  form,
  isTranslating,
  vehicleTypes,
  onFieldChange,
  onAutoTranslate,
  onAddTier,
  onRemoveTier,
  onUpdateTier,
  onSubmit,
}: PackageDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl p-0 overflow-hidden border-none rounded-2xl shadow-2xl flex flex-col max-h-[95vh]">
        <DialogHeader className="p-6 bg-muted/30 border-b border-card-border shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-primary-500" />
            {editing ? "Edit Detail Paket" : "Buat Paket Wisata Baru"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-0">
          <PackageForm 
            form={form}
            isTranslating={isTranslating}
            vehicleTypes={vehicleTypes}
            onFieldChange={onFieldChange}
            onAutoTranslate={onAutoTranslate}
            onAddTier={onAddTier}
            onRemoveTier={onRemoveTier}
            onUpdateTier={onUpdateTier}
          />
        </div>

        <div className="shrink-0 flex justify-end gap-3 p-6 bg-muted/30 border-t border-card-border">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="rounded-md text-xs tracking-wider uppercase font-bold px-6 h-10"
          >
            Batal
          </Button>
          <Button
            onClick={onSubmit}
            disabled={isPending}
            className="bg-primary-500 hover:bg-primary-600 text-white min-w-[150px] rounded-md shadow-md text-xs tracking-wider uppercase font-bold h-10"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <CheckCircle className="w-4 h-4 mr-2" />
            )}
            {editing ? "Simpan Perubahan" : "Buat Paket"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
