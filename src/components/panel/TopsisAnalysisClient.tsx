"use client";

import { useState } from "react";
import { PageHeader } from "./PageHeader";
import { FormCard } from "./FormCard";
import {
  Trophy,
  TrendingUp,
  Scale,
  Info,
  AlertCircle,
  Package,
  ArrowRight,
  Zap,
  Edit2,
  X,
} from "lucide-react";
import { TopsisResult } from "@/lib/topsis";
import { SaveButton } from "./SaveButton";
import { updateTopsisCriteria, getTopsisAnalysis } from "@/lib/actions/topsis";
import { TopsisDetailDialog } from "@/app/(panel)/admin/topsis/components/TopsisDetailDialog";

interface TopsisAnalysisClientProps {
  initialData: {
    results: TopsisResult[];
    criteria: any[]; // Criterion from Prisma
  };
}

export function TopsisAnalysisClient({
  initialData,
}: TopsisAnalysisClientProps) {
  const [data, setData] = useState(initialData);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCriteria, setEditedCriteria] = useState(initialData.criteria);
  const [isPending, setIsPending] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  // State for detail dialog
  const [selectedResult, setSelectedResult] = useState<any>(null);
  const [showDetail, setShowDetail] = useState(false);

  const totalWeight = editedCriteria.reduce((sum, c) => sum + c.weight, 0);
  const isWeightValid = Math.abs(totalWeight - 1.0) < 0.0001;

  const getRankColor = (rank: number) => {
    if (rank === 1)
      return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
    if (rank === 2) return "bg-slate-400/10 text-slate-600 border-slate-400/20";
    if (rank === 3) return "bg-amber-700/10 text-amber-700 border-amber-700/20";
    return "bg-foreground/5 text-foreground-secondary border-card-border";
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-600" />;
    return <span className="font-bold">#{rank}</span>;
  };

  const handleSaveCriteria = async () => {
    if (!isWeightValid) return;

    setIsPending(true);
    const result = await updateTopsisCriteria(
      editedCriteria.map((c) => ({
        id: c.id,
        weight: c.weight,
        type: c.type,
      })),
    );

    if (result.success) {
      const newData = await getTopsisAnalysis();
      setData(newData);
      setIsSaved(true);
      setTimeout(() => {
        setIsSaved(false);
        setIsEditing(false);
      }, 1500);
    } else {
      alert(result.error);
    }
    setIsPending(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader
        title="Analisis Rekomendasi TOPSIS"
        description="Hasil perhitungan perankingan paket wisata berdasarkan kriteria objektif."
        action={
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
              isEditing
                ? "bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20"
                : "bg-primary-500/10 text-primary-500 border-primary-500/20 hover:bg-primary-500/20"
            }`}
          >
            {isEditing ? (
              <>
                <X className="w-4 h-4" />
                <span>Batal Edit</span>
              </>
            ) : (
              <>
                <Edit2 className="w-4 h-4" />
                <span>Atur Kriteria</span>
              </>
            )}
          </button>
        }
      />

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card-bg border border-card-border rounded-xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-primary-500/10 flex items-center justify-center text-primary-500">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-foreground-secondary">
              Total Alternatif
            </p>
            <p className="text-2xl font-bold text-foreground">
              {data.results.length} Paket
            </p>
          </div>
        </div>

        <div className="bg-card-bg border border-card-border rounded-xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-accent-500/10 flex items-center justify-center text-accent-500">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-foreground-secondary">Kriteria Aktif</p>
            <p className="text-2xl font-bold text-foreground">
              {data.criteria.length} Kriteria
            </p>
          </div>
        </div>

        <div className="bg-card-bg border border-card-border rounded-xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-foreground-secondary">Metode</p>
            <p className="text-2xl font-bold text-foreground">TOPSIS</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Criteria Summary / Editor */}
        <div className="lg:col-span-1 space-y-6">
          <FormCard
            title={isEditing ? "Master Data Kriteria" : "Konfigurasi Kriteria"}
          >
            <p className="text-sm text-foreground-secondary -mt-4 mb-4">
              Bobot dan sifat penilaian.
            </p>

            <div className="space-y-4">
              {(isEditing ? editedCriteria : data.criteria).map(
                (c: any, index: number) => (
                  <div
                    key={c.id}
                    className={`p-4 rounded-lg border transition-all ${
                      isEditing
                        ? "border-primary-500/30 bg-primary-500/5 shadow-sm"
                        : "border-card-border bg-foreground/5"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-foreground">
                        {c.code}: {c.name}
                      </span>
                      {isEditing ? (
                        <select
                          value={c.type}
                          onChange={(e) => {
                            const newCriteria = [...editedCriteria];
                            newCriteria[index].type = e.target.value;
                            setEditedCriteria(newCriteria);
                          }}
                          className="bg-card-bg border border-card-border rounded px-2 py-1 text-[10px] font-bold text-primary-500 outline-none"
                        >
                          <option value="COST">COST</option>
                          <option value="BENEFIT">BENEFIT</option>
                        </select>
                      ) : (
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            c.type === "COST"
                              ? "bg-red-500/10 text-red-500"
                              : "bg-blue-500/10 text-blue-500"
                          }`}
                        >
                          {c.type}
                        </span>
                      )}
                    </div>

                    <div className="flex justify-between items-center text-sm gap-4">
                      <span className="text-foreground-secondary text-xs shrink-0">
                        Bobot (0-1)
                      </span>
                      {isEditing ? (
                        <input
                          type="number"
                          step="0.05"
                          min="0"
                          max="1"
                          value={c.weight}
                          onChange={(e) => {
                            const newCriteria = [...editedCriteria];
                            newCriteria[index].weight =
                              parseFloat(e.target.value) || 0;
                            setEditedCriteria(newCriteria);
                          }}
                          className="w-20 bg-card-bg border border-card-border rounded px-2 py-1 text-right font-mono text-primary-500 text-xs outline-none focus:border-primary-500"
                        />
                      ) : (
                        <span className="font-mono text-primary-500">
                          {(c.weight * 100).toFixed(0)}%
                        </span>
                      )}
                    </div>

                    <div className="w-full bg-card-border h-1.5 rounded-full mt-3 overflow-hidden">
                      <div
                        className="bg-primary-500 h-full transition-all duration-500"
                        style={{ width: `${c.weight * 100}%` }}
                      />
                    </div>
                  </div>
                ),
              )}

              {isEditing && (
                <div className="pt-4 border-t border-card-border space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-foreground-secondary">
                      Total Bobot
                    </span>
                    <span
                      className={`font-bold ${isWeightValid ? "text-green-500" : "text-red-500"}`}
                    >
                      {(totalWeight * 100).toFixed(0)}% / 100%
                    </span>
                  </div>

                  {!isWeightValid && (
                    <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/20 flex gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                      <p className="text-[10px] text-red-500">
                        Total bobot harus tepat 100% (1.0).
                      </p>
                    </div>
                  )}

                  <SaveButton
                    onClick={handleSaveCriteria}
                    isPending={isPending}
                    saved={isSaved}
                    disabled={!isWeightValid}
                    className="w-full"
                  />
                </div>
              )}

              {!isEditing && (
                <div className="p-4 rounded-lg bg-primary-500/5 border border-primary-500/20 flex gap-3">
                  <Info className="w-5 h-5 text-primary-500 shrink-0" />
                  <p className="text-xs text-foreground-secondary leading-relaxed">
                    Semakin tinggi bobot, semakin besar pengaruh kriteria
                    tersebut terhadap hasil akhir.
                  </p>
                </div>
              )}
            </div>
          </FormCard>
        </div>

        {/* Results Table */}
        <div className="lg:col-span-2">
          <div className="bg-card-bg border border-card-border rounded-xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-card-border bg-foreground/5 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  Peringkat Alternatif
                </h3>
                <p className="text-sm text-foreground-secondary">
                  Hasil akhir nilai preferensi (Vi)
                </p>
              </div>
              <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-600">
                <Zap className="w-5 h-5 fill-current" />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-card-border bg-foreground/2">
                    <th className="px-6 py-4 text-xs font-bold text-foreground-secondary uppercase">
                      Rank
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-foreground-secondary uppercase">
                      Paket Wisata
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-foreground-secondary uppercase text-center">
                      Skor (Vi)
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-foreground-secondary uppercase text-right">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-card-border">
                  {data.results.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-12 text-center text-foreground-secondary"
                      >
                        <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-20" />
                        Belum ada data paket wisata untuk dianalisis.
                      </td>
                    </tr>
                  ) : (
                    data.results.map((res: any) => (
                      <tr
                        key={res.id}
                        className="hover:bg-foreground/2 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div
                            className={`w-10 h-10 rounded-lg border flex items-center justify-center ${getRankColor(
                              res.ranking,
                            )}`}
                          >
                            {getRankIcon(res.ranking)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-foreground group-hover:text-primary-600 transition-colors">
                            {res.name}
                          </p>
                          <div className="flex gap-4 mt-1">
                            <span className="text-[10px] text-foreground-secondary">
                              C1: Rp{res.c1_price.toLocaleString()}
                            </span>
                            <span className="text-[10px] text-foreground-secondary">
                              C2: {res.c2_facilities}/5
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex flex-col items-center gap-1">
                            <span className="font-mono font-bold text-foreground">
                              {res.score.toFixed(4)}
                            </span>
                            <div className="w-24 bg-card-border h-1 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  res.ranking === 1
                                    ? "bg-yellow-500"
                                    : "bg-primary-500"
                                }`}
                                style={{ width: `${res.score * 100}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => {
                              setSelectedResult(res);
                              setShowDetail(true);
                            }}
                            className="p-2 rounded-lg hover:bg-primary-500/10 text-foreground-secondary hover:text-primary-600 transition-colors flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider ml-auto"
                          >
                            <span>Detail Math</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-foreground/2 border-t border-card-border">
              <p className="text-[11px] text-center text-foreground-secondary italic">
                *Nilai Preferensi (Vi) dihitung berdasarkan jarak kedekatan
                dengan solusi ideal positif.
              </p>
            </div>
          </div>
        </div>
      </div>

      <TopsisDetailDialog 
        open={showDetail}
        onOpenChange={setShowDetail}
        booking={selectedResult}
        criteria={data.criteria}
        allPackages={data.results}
      />
    </div>
  );
}
