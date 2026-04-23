"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock, Scale } from "lucide-react";

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
  return (
    <div className="p-5 rounded-xl bg-primary-500/5 border border-primary-500/20 space-y-5">
      <div className="flex items-center gap-2">
        <Scale className="w-4 h-4 text-primary-500" />
        <Label className="text-[10px] font-bold uppercase tracking-wider text-primary-600">
          Skor Rekomendasi TOPSIS
        </Label>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label className="text-[10px] font-bold text-foreground-secondary uppercase tracking-tighter">
              Kualitas Fasilitas
            </Label>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary-500 text-white">
              {facilityScore} / 5
            </span>
          </div>
          <Input
            type="range"
            min="1"
            max="5"
            step="1"
            value={facilityScore}
            onChange={(e) => onChange("facilityScore", parseInt(e.target.value))}
            className="h-6 cursor-pointer accent-primary-500"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] font-bold text-foreground-secondary uppercase tracking-tighter">
            Waktu Keberangkatan
          </Label>
          <select
            value={departureScore}
            onChange={(e) => onChange("departureScore", parseInt(e.target.value))}
            className="w-full bg-white border border-card-border rounded-md h-9 px-3 text-xs outline-none focus:border-primary-500 shadow-sm"
          >
            <option value={1}>Pagi (Optimalkan Cepat)</option>
            <option value={2}>Siang (Standar)</option>
            <option value={3}>Malam (Santai)</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] font-bold text-foreground-secondary uppercase tracking-tighter">
            Durasi Perjalanan (Hari)
          </Label>
          <div className="relative">
            <Input
              type="number"
              min="1"
              value={durationDays}
              onChange={(e) => onChange("durationDays", parseInt(e.target.value))}
              className="rounded-md h-9 pl-9"
            />
            <Clock className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
          </div>
        </div>
      </div>
    </div>
  );
}
