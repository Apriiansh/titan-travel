"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Tag, X } from "lucide-react";
import { PackageFormState } from "../types";

interface PriceTierSectionProps {
  priceTiers: PackageFormState["priceTiers"];
  onAddTier: () => void;
  onRemoveTier: (index: number) => void;
  onUpdateTier: (index: number, field: string, value: string) => void;
}

export function PriceTierSection({
  priceTiers,
  onAddTier,
  onRemoveTier,
  onUpdateTier,
}: PriceTierSectionProps) {
  return (
    <div className="p-5 rounded-xl bg-muted/20 border border-card-border space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-primary-500" />
          <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Harga & Diskon
          </Label>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onAddTier}
          className="h-7 text-[9px] gap-1 text-primary-600 px-3 border border-primary-100 bg-primary-50/50"
        >
          <Plus className="w-3 h-3" /> Tambah Tier
        </Button>
      </div>

      <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
        <p className="text-[9px] text-amber-700 leading-relaxed italic">
          <strong>Tips:</strong> Kamu bisa ketik{" "}
          <code className="bg-amber-100 px-1 rounded text-amber-900 font-bold">
            %
          </code>{" "}
          di kolom Harga Promo (cth:{" "}
          <code className="bg-amber-100 px-1 rounded text-amber-900 font-bold">
            %10
          </code>
          ) untuk hitung otomatis dari Harga Asli.
        </p>
      </div>

      {priceTiers.length === 0 ? (
        <p className="text-[10px] text-muted-foreground text-center py-4 border-2 border-dashed rounded-lg">
          Belum ada tier harga.
        </p>
      ) : (
        <div className="space-y-4">
          {priceTiers.map((tier, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg bg-card-bg border border-card-border shadow-sm space-y-3 relative group/tier"
            >
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-[9px] text-muted-foreground">
                    Min Pax
                  </Label>
                  <Input
                    type="number"
                    value={tier.minPax}
                    onChange={(e) => onUpdateTier(idx, "minPax", e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[9px] text-muted-foreground">
                    Max Pax
                  </Label>
                  <Input
                    type="number"
                    value={tier.maxPax}
                    onChange={(e) => onUpdateTier(idx, "maxPax", e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-[9px] text-muted-foreground">
                    Harga Asli (Coret)
                  </Label>
                  <Input
                    type="number"
                    value={tier.originalPrice}
                    onChange={(e) =>
                      onUpdateTier(idx, "originalPrice", e.target.value)
                    }
                    className="h-8 text-xs"
                    placeholder="Cth: 1000000"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[9px] text-muted-foreground">
                    Harga Promo / %
                  </Label>
                  <Input
                    type="text"
                    value={tier.price}
                    onChange={(e) => onUpdateTier(idx, "price", e.target.value)}
                    className="h-8 text-xs border-primary-200"
                    placeholder="% atau Rp"
                  />
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemoveTier(idx)}
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-white shadow-md border border-red-100 text-red-500 hover:bg-red-50"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
