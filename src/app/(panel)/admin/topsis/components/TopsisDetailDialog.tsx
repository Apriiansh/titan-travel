"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Calculator, 
  Target, 
  ArrowDown, 
  Zap,
  Star,
  Clock,
  Banknote,
  Timer,
  Scale
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TopsisDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: any; // The selected package result
  criteria: any[];
  allPackages: any[];
}

export function TopsisDetailDialog({
  open,
  onOpenChange,
  booking,
  criteria,
  allPackages,
}: TopsisDetailDialogProps) {
  if (!booking) return null;

  // --- RE-CALCULATE INTERMEDIATE STEPS FOR DISPLAY ---
  // Step 1: Dividers for Normalization
  const sums = { c1: 0, c2: 0, c3: 0, c4: 0 };
  allPackages.forEach(alt => {
    sums.c1 += Math.pow(alt.c1_price, 2);
    sums.c2 += Math.pow(alt.c2_facilities, 2);
    sums.c3 += Math.pow(alt.c3_departure, 2);
    sums.c4 += Math.pow(alt.c4_duration, 2);
  });

  const divisors = {
    c1: Math.sqrt(sums.c1) || 1,
    c2: Math.sqrt(sums.c2) || 1,
    c3: Math.sqrt(sums.c3) || 1,
    c4: Math.sqrt(sums.c4) || 1,
  };

  // Step 2: Normalization (R)
  const r = {
    c1: (booking.c1_price / divisors.c1).toFixed(4),
    c2: (booking.c2_facilities / divisors.c2).toFixed(4),
    c3: (booking.c3_departure / divisors.c3).toFixed(4),
    c4: (booking.c4_duration / divisors.c4).toFixed(4),
  };

  // Step 3: Weighted Normalization (Y)
  const weights = {
    c1: criteria.find(c => c.code === "C1")?.weight || 0,
    c2: criteria.find(c => c.code === "C2")?.weight || 0,
    c3: criteria.find(c => c.code === "C3")?.weight || 0,
    c4: criteria.find(c => c.code === "C4")?.weight || 0,
  };

  const y = {
    c1: (parseFloat(r.c1) * weights.c1).toFixed(4),
    c2: (parseFloat(r.c2) * weights.c2).toFixed(4),
    c3: (parseFloat(r.c3) * weights.c3).toFixed(4),
    c4: (parseFloat(r.c4) * weights.c4).toFixed(4),
  };

  // Pre-calculated in parent but we show it here
  const score = booking.score.toFixed(4);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden border-none rounded-2xl shadow-2xl">
        <DialogHeader className="p-6 bg-slate-50 border-b border-card-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary-500 text-white">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold">Detail Perhitungan TOPSIS</DialogTitle>
                <p className="text-xs text-slate-500 font-medium">Analisis Transparan: {booking.name}</p>
              </div>
            </div>
            <Badge className="bg-yellow-500 text-white border-none font-bold">
              Ranking #{booking.ranking}
            </Badge>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-8 max-h-[70vh] overflow-y-auto">
          {/* STEP 1: MATRIKS KEPUTUSAN */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-primary-500" />
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700">Langkah 1: Matriks Keputusan (X)</h4>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <ValueCard label="Harga (C1)" value={`Rp ${booking.c1_price.toLocaleString()}`} icon={<Banknote className="w-3 h-3"/>} />
              <ValueCard label="Fasilitas (C2)" value={`${booking.c2_facilities}/5`} icon={<Star className="w-3 h-3"/>} />
              <ValueCard label="Waktu (C3)" value={booking.c3_departure} icon={<Clock className="w-3 h-3"/>} />
              <ValueCard label="Durasi (C4)" value={`${booking.c4_duration} Hari`} icon={<Timer className="w-3 h-3"/>} />
            </div>
          </section>

          <ArrowDown className="w-4 h-4 mx-auto text-slate-300" />

          {/* STEP 2: NORMALISASI */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700">Langkah 2: Normalisasi (R)</h4>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-200">
                    <th className="pb-2 text-left">Kriteria</th>
                    <th className="pb-2 text-right">Nilai Asli</th>
                    <th className="pb-2 text-center">Pembagi</th>
                    <th className="pb-2 text-right text-primary-600">Hasil (R)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <TableRow label="C1 (Harga)" original={booking.c1_price} divisor={divisors.c1.toFixed(2)} result={r.c1} />
                  <TableRow label="C2 (Fasilitas)" original={booking.c2_facilities} divisor={divisors.c2.toFixed(2)} result={r.c2} />
                  <TableRow label="C3 (Waktu)" original={booking.c3_departure} divisor={divisors.c3.toFixed(2)} result={r.c3} />
                  <TableRow label="C4 (Durasi)" original={booking.c4_duration} divisor={divisors.c4.toFixed(2)} result={r.c4} />
                </tbody>
              </table>
            </div>
          </section>

          <ArrowDown className="w-4 h-4 mx-auto text-slate-300" />

          {/* STEP 3: TERBOBOT */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-blue-500" />
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700">Langkah 3: Matriks Terbobot (Y)</h4>
            </div>
            <div className="bg-blue-50/30 rounded-xl p-4 border border-blue-100">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr className="text-slate-400 border-b border-blue-100">
                    <th className="pb-2 text-left">Kriteria</th>
                    <th className="pb-2 text-right">Nilai R</th>
                    <th className="pb-2 text-center">Bobot (W)</th>
                    <th className="pb-2 text-right text-blue-600">Hasil (Y)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-50">
                  <TableRow label="C1" original={r.c1} divisor={weights.c1} result={y.c1} />
                  <TableRow label="C2" original={r.c2} divisor={weights.c2} result={y.c2} />
                  <TableRow label="C3" original={r.c3} divisor={weights.c3} result={y.c3} />
                  <TableRow label="C4" original={r.c4} divisor={weights.c4} result={y.c4} />
                </tbody>
              </table>
            </div>
          </section>

          {/* FINAL RESULT */}
          <div className="p-6 rounded-2xl bg-primary-600 text-white flex justify-between items-center shadow-xl shadow-primary-500/20">
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest opacity-80">Skor Akhir Preferensi (Vi)</p>
              <h3 className="text-4xl font-black">{score}</h3>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold tracking-widest opacity-80">Status Rekomendasi</p>
              <p className="text-xl font-bold">{booking.ranking === 1 ? "PILIHAN UTAMA" : "ALTERNATIF"}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ValueCard({ label, value, icon }: { label: string; value: string; icon: any }) {
  return (
    <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
      <div className="flex items-center gap-1.5 mb-1">
        <div className="text-slate-400">{icon}</div>
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{label}</p>
      </div>
      <p className="text-xs font-bold text-slate-800">{value}</p>
    </div>
  );
}

function TableRow({ label, original, divisor, result }: { label: string; original: any; divisor: any; result: any }) {
  return (
    <tr className="hover:bg-white/50">
      <td className="py-2 font-bold text-slate-600">{label}</td>
      <td className="py-2 text-right text-slate-500">{original}</td>
      <td className="py-2 text-center text-slate-400">× {divisor}</td>
      <td className="py-2 text-right font-bold text-primary-600">{result}</td>
    </tr>
  );
}
