"use client";

import { Button } from "@/components/ui/button";
import { Printer, MapPin, Phone, Mail, Globe } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export function ReportTopsisClient({ data }: { data: any }) {
  const { results, criteria } = data;

  return (
    <div className="space-y-8 pb-20">
      <div className="flex justify-end bg-card-bg p-6 rounded-2xl border border-card-border shadow-sm no-print">
        <Button 
          variant="outline"
          onClick={() => window.print()}
          className="h-10 px-6 rounded-xl border-card-border gap-2 font-bold"
        >
          <Printer className="w-4 h-4" /> Cetak Laporan Ranking
        </Button>
      </div>

      {/* PAPER PREVIEW */}
      <div className="bg-white shadow-2xl rounded-sm border border-slate-200 mx-auto max-w-[210mm] min-h-[297mm] p-[20mm] text-slate-900 print:shadow-none print:border-none print:m-0 print:p-0">
        
        {/* KOP SURAT */}
        <div className="flex items-start justify-between border-b-4 border-double border-slate-800 pb-6 mb-8 text-slate-900">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg bg-primary-600 flex items-center justify-center text-white font-black text-3xl">
              T
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter uppercase leading-none">CV Titan Jaya Travelindo</h1>
              <p className="text-[10px] font-bold text-slate-500 uppercase mt-1 tracking-widest">Biro Perjalanan Wisata & Transportasi</p>
              <div className="flex flex-col gap-1 mt-3 text-[9px] font-medium text-slate-600 italic">
                <span className="flex items-center gap-1.5"><MapPin className="w-2.5 h-2.5" /> Jl. Demang Lebar Daun No. 123, Palembang, Sumatera Selatan</span>
                <span className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5"><Phone className="w-2.5 h-2.5" /> +62 812-3456-7890</span>
                  <span className="flex items-center gap-1.5"><Mail className="w-2.5 h-2.5" /> info@titantravel.com</span>
                  <span className="flex items-center gap-1.5"><Globe className="w-2.5 h-2.5" /> www.titantravel.com</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* JUDUL LAPORAN */}
        <div className="text-center mb-10 text-slate-900">
          <h2 className="text-xl font-bold uppercase underline decoration-slate-300 underline-offset-8">Laporan Hasil Rekomendasi TOPSIS</h2>
          <p className="text-xs text-slate-500 mt-3 font-medium italic">
            Perankingan Paket Wisata Berdasarkan Kriteria Objektif
          </p>
        </div>

        {/* KONFIGURASI KRITERIA */}
        <div className="mb-8 text-slate-900">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Konfigurasi Kriteria & Bobot:</h4>
          <div className="grid grid-cols-4 gap-4">
            {criteria.map((c: any) => (
              <div key={c.id} className="p-2 border border-slate-200 rounded-lg bg-slate-50/50">
                <p className="text-[8px] font-black text-slate-400 uppercase">{c.code}</p>
                <p className="text-[10px] font-bold text-slate-800">{c.name}</p>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-[9px] font-bold text-primary-600">{(c.weight * 100).toFixed(0)}%</span>
                  <span className="text-[7px] px-1 bg-slate-200 rounded font-bold">{c.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TABEL DATA RANKING */}
        <table className="w-full text-[10px] border-collapse mb-10 text-slate-900">
          <thead>
            <tr className="bg-slate-50 border-y border-slate-200">
              <th className="py-3 px-2 text-center border-x border-slate-200">RANK</th>
              <th className="py-3 px-2 text-left border-x border-slate-200">NAMA PAKET WISATA</th>
              <th className="py-3 px-2 text-center border-x border-slate-200">C1</th>
              <th className="py-3 px-2 text-center border-x border-slate-200">C2</th>
              <th className="py-3 px-2 text-center border-x border-slate-200">C3</th>
              <th className="py-3 px-2 text-center border-x border-slate-200">C4</th>
              <th className="py-3 px-2 text-right border-x border-slate-200">SKOR (Vi)</th>
            </tr>
          </thead>
          <tbody>
            {results.map((res: any) => (
              <tr key={res.id} className={`border-b border-slate-100 ${res.ranking === 1 ? "bg-yellow-50/30" : ""}`}>
                <td className="py-2.5 px-2 border-x border-slate-100 text-center font-black">#{res.ranking}</td>
                <td className="py-2.5 px-2 border-x border-slate-100 font-bold">{res.name}</td>
                <td className="py-2.5 px-2 border-x border-slate-100 text-center text-slate-500">Rp{res.c1_price.toLocaleString()}</td>
                <td className="py-2.5 px-2 border-x border-slate-100 text-center text-slate-500">{res.c2_facilities}</td>
                <td className="py-2.5 px-2 border-x border-slate-100 text-center text-slate-500">{res.c3_departure}</td>
                <td className="py-2.5 px-2 border-x border-slate-100 text-center text-slate-500">{res.c4_duration}</td>
                <td className="py-2.5 px-2 border-x border-slate-100 text-right font-black text-primary-600">{res.score.toFixed(4)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* TANDA TANGAN */}
        <div className="flex justify-end mt-20 text-slate-900">
          <div className="text-center w-64 space-y-16">
            <div>
              <p className="text-xs font-medium">Palembang, {format(new Date(), "dd MMMM yyyy", { locale: id })}</p>
              <p className="text-xs font-bold uppercase mt-1">Manager Operasional</p>
            </div>
            <div className="border-b border-slate-400 w-48 mx-auto"></div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">( Tanda Tangan & Nama Terang )</p>
          </div>
        </div>

        {/* FOOTER LAPORAN */}
        <div className="mt-20 pt-4 border-t border-slate-100 text-[8px] text-slate-400 text-center uppercase tracking-widest">
          Laporan Sistem Pendukung Keputusan Paket Wisata Titan Travel • Halaman 1 dari 1
        </div>
      </div>
    </div>
  );
}
