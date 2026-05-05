"use client";
import SafeImage from "@/components/ui/safe-image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/panel/ConfirmDialog";
import { 
  Pencil, 
  Trash2, 
  Eye, 
  EyeOff, 
  MapPin, 
  Clock, 
  Tag, 
  Image as ImageIcon 
} from "lucide-react";
import { Package } from "../types";
import { useLocale } from "@/lib/LocaleContext";
import { translations } from "@/lib/translations";
import { formatCurrency } from "@/lib/utils";

interface PackageTableProps {
  packages: Package[];
  onEdit: (pkg: Package) => void;
  onDelete: (id: string) => void;
  onTogglePublish: (id: string, current: boolean) => void;
  isPending: boolean;
}

export function PackageTable({ 
  packages, 
  onEdit, 
  onDelete, 
  onTogglePublish, 
  isPending 
}: PackageTableProps) {
  const { dObj, locale, rates, dt } = useLocale();
  const t = dObj(translations).adminPanel.packages;

  if (packages.length === 0) {
    return (
      <div className="rounded-md border border-card-border bg-card-bg shadow-sm overflow-hidden p-24">
        <div className="flex flex-col items-center justify-center text-foreground-secondary space-y-4">
          <Tag className="w-12 h-12 text-muted-foreground/20" />
          <p className="text-sm font-medium">
            {t?.empty || "Belum ada paket wisata. Tambahkan yang pertama!"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-card-border bg-card-bg shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-card-border bg-muted/30">
              <th className="text-left px-6 py-4 font-bold text-foreground-secondary uppercase tracking-wider text-[10px]">
                {t?.table?.package || "Paket"}
              </th>
              <th className="text-left px-6 py-4 font-bold text-foreground-secondary uppercase tracking-wider text-[10px] hidden md:table-cell">
                {t?.table?.location || "Lokasi"}
              </th>
              <th className="text-left px-6 py-4 font-bold text-foreground-secondary uppercase tracking-wider text-[10px] hidden lg:table-cell">
                {t?.table?.duration || "Durasi"}
              </th>
              <th className="text-right px-6 py-4 font-bold text-foreground-secondary uppercase tracking-wider text-[10px]">
                {t?.table?.price || "Harga"}
              </th>
              <th className="text-center px-6 py-4 font-bold text-foreground-secondary uppercase tracking-wider text-[10px]">
                {t?.table?.status || "Status"}
              </th>
              <th className="text-center px-6 py-4 font-bold text-foreground-secondary uppercase tracking-wider text-[10px]">
                {t?.table?.action || "Aksi"}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-card-border">
            {packages.map((pkg) => (
              <tr key={pkg.id} className="group hover:bg-muted/20 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md overflow-hidden bg-muted shrink-0 relative">
                      {pkg.images?.[0] ? (
                        <SafeImage
                          src={pkg.images[0]}
                          alt={dt(pkg.title) || "Package"}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      ) : (
                        <ImageIcon className="w-4 h-4 m-3 text-muted-foreground/40" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground truncate max-w-50">
                        {dt(pkg.title)}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-foreground-secondary hidden md:table-cell">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-muted-foreground" />
                    <span className="truncate max-w-30">
                      {dt(pkg.location)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-foreground-secondary hidden lg:table-cell">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <span>{dt(pkg.duration)}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div>
                    <p className="font-bold text-primary-600">
                      {formatCurrency(Number(pkg.price), locale, rates)}
                    </p>
                    {pkg.originalPrice && Number(pkg.originalPrice) > 0 && (
                      <p className="text-[10px] text-muted-foreground line-through decoration-red-400/50">
                        {formatCurrency(Number(pkg.originalPrice), locale, rates)}
                      </p>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => onTogglePublish(pkg.id, pkg.isPublished)}
                    disabled={isPending}
                    className="focus:outline-none"
                  >
                    <Badge
                      variant="secondary"
                      className={`rounded-full px-2 py-0.5 text-[10px] flex items-center gap-1 border transition-colors ${
                        pkg.isPublished
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-muted text-muted-foreground border-transparent"
                      }`}
                    >
                      {pkg.isPublished ? (
                        <>
                          <Eye className="w-2.5 h-2.5" /> {t?.status?.published || "Publik"}
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-2.5 h-2.5" /> {t?.status?.draft || "Draft"}
                        </>
                      )}
                    </Badge>
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-md text-muted-foreground hover:text-primary-500 hover:bg-primary-50"
                      onClick={() => onEdit(pkg)}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <ConfirmDialog
                      trigger={
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-md text-muted-foreground hover:text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      }
                      onConfirm={() => onDelete(pkg.id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
