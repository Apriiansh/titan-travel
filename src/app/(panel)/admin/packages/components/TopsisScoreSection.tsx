"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Scale, 
  Clock, 
  Star, 
  Info,
  Zap,
  Coffee,
  Moon
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLocale } from "@/lib/LocaleContext";
import { translations } from "@/lib/translations";

interface TopsisScoreSectionProps {
  facilityScore: number;
  departureScore: number;
  durationDays: number;
  onChange: (field: string, value: any) => void;
}

export function TopsisScoreSection({
  facilityScore,
  departureScore,
  durationDays,
  onChange,
}: TopsisScoreSectionProps) {
  const { dObj } = useLocale();
  const t = dObj(translations).adminPanel.packages.form.sections.topsis;

  return (
    <TooltipProvider>
      <div className="p-6 rounded-2xl bg-white border border-card-border shadow-sm space-y-6 relative overflow-hidden">
        {/* Decorative Background Icon */}
        <Scale className="absolute -right-4 -bottom-4 w-24 h-24 text-primary-500/5 rotate-12" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-primary-500/10 text-primary-600">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <Label className="text-sm font-bold text-slate-900 block">
                {t?.title || "Kriteria Rekomendasi"}
              </Label>
              <p className="text-[10px] text-slate-500 font-medium">
                {t?.subtitle || "Pengaturan Algoritma TOPSIS"}
              </p>
            </div>
          </div>
          <Tooltip>
            <TooltipTrigger>
              <div className="text-slate-400 hover:text-primary-500 transition-colors cursor-help">
                <Info className="w-4 h-4" />
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-50 text-[11px] p-3 leading-relaxed">
              {t?.tooltip || "Nilai ini digunakan oleh sistem untuk meranking paket wisata berdasarkan preferensi pengguna."}
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="space-y-6 relative z-10">
          {/* C2: Fasilitas (Benefit) */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Star className="w-3.5 h-3.5 text-amber-500" />
                <Label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                  {t?.fields?.facility || "Kualitas Fasilitas (C2)"}
                </Label>
              </div>
              <span className="text-xs font-black text-primary-600 bg-primary-50 px-2.5 py-0.5 rounded-full border border-primary-100">
                {facilityScore}/5
              </span>
            </div>
            <div className="pt-2">
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={facilityScore}
                onChange={(e) => onChange("facilityScore", parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary-500"
              />
              <div className="flex justify-between mt-2 px-1">
                {[1, 2, 3, 4, 5].map((val) => (
                  <span 
                    key={val} 
                    className={`text-[9px] font-bold ${facilityScore === val ? "text-primary-600" : "text-slate-300"}`}
                  >
                    {val}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* C3: Waktu Keberangkatan (Cost) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-blue-500" />
              <Label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                {t?.fields?.departure || "Waktu Berangkat (C3)"}
              </Label>
            </div>
            <Select
              value={departureScore.toString()}
              onValueChange={(val) => val && onChange("departureScore", parseInt(val))}
            >
              <SelectTrigger className="h-10 bg-slate-50/50 border-slate-200 text-xs font-semibold rounded-xl focus:ring-primary-500/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl shadow-xl min-w-70">
                <SelectItem value="1" className="py-2.5">
                  <div className="flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>{t?.fields?.morning || "Pagi (Skor 1 - Prioritas Cepat)"}</span>
                  </div>
                </SelectItem>
                <SelectItem value="2" className="py-2.5">
                  <div className="flex items-center gap-2">
                    <Coffee className="w-3.5 h-3.5 text-blue-500" />
                    <span>{t?.fields?.afternoon || "Siang (Skor 2 - Standar)"}</span>
                  </div>
                </SelectItem>
                <SelectItem value="3" className="py-2.5">
                  <div className="flex items-center gap-2">
                    <Moon className="w-3.5 h-3.5 text-slate-400" />
                    <span>{t?.fields?.evening || "Malam (Skor 3 - Santai)"}</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-[9px] text-slate-400 font-medium italic">
              {t?.notes?.departure || "*Dalam TOPSIS, waktu yang lebih awal (skor kecil) dianggap lebih efisien."}
            </p>
          </div>

          {/* C4: Durasi (Cost) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-3.5 h-3.5 text-emerald-500" />
              <Label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                {t?.fields?.duration || "Durasi Perjalanan (C4)"}
              </Label>
            </div>
            <div className="relative">
              <Input
                type="number"
                min="1"
                value={durationDays}
                onChange={(e) => onChange("durationDays", parseInt(e.target.value))}
                className="h-10 pl-10 bg-slate-50/50 border-slate-200 font-bold text-sm rounded-xl"
              />
              <Clock className="w-4 h-4 text-slate-300 absolute left-3.5 top-3" />
              <span className="absolute right-10 top-3 text-[10px] font-bold text-slate-400 uppercase">
                {t?.fields?.dayUnit || "Hari"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

function CalendarIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M16 14h.01" />
      <path d="M8 18h.01" />
      <path d="M12 18h.01" />
      <path d="M16 18h.01" />
    </svg>
  );
}
