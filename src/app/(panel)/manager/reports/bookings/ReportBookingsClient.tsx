"use client";

import { useState } from "react";
import { PageHeader } from "@/components/panel/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Printer, 
  Filter, 
  Calendar,
  MapPin,
  Phone,
  Mail,
  Globe
} from "lucide-react";
import { getBookingReport } from "@/lib/actions/reports";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export function ReportBookingsClient({ initialData }: { initialData: any[] }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);

  const handleFilter = async () => {
    setIsLoading(true);
    try {
        const result = await getBookingReport(startDate, endDate);
        setData(result);
    } finally {
        setIsLoading(false);
    }
  };

  const totalRevenue = data.reduce((sum, b) => sum + Number(b.amountPaid), 0);

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-end gap-4 bg-card-bg p-6 rounded-2xl border border-card-border shadow-sm no-print">
        <div className="flex-1 space-y-2">
          <label className="text-xs font-bold text-foreground-secondary uppercase tracking-wider">Mulai Tanggal</label>
          <div className="relative">
            <Input 
              type="date" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-background border-card-border pl-10"
            />
            <Calendar className="w-4 h-4 text-foreground-secondary absolute left-3 top-2.5" />
          </div>
        </div>
        <div className="flex-1 space-y-2">
          <label className="text-xs font-bold text-foreground-secondary uppercase tracking-wider">Sampai Tanggal</label>
          <div className="relative">
            <Input 
              type="date" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-background border-card-border pl-10"
            />
            <Calendar className="w-4 h-4 text-foreground-secondary absolute left-3 top-2.5" />
          </div>
        </div>
        <Button 
          onClick={handleFilter} 
          disabled={isLoading}
          className="bg-primary-500 hover:bg-primary-600 h-10 px-6 rounded-xl gap-2 font-bold"
        >
          {isLoading ? "Memuat..." : <><Filter className="w-4 h-4" /> Filter Data</>}
        </Button>
        <Button 
          variant="outline"
          onClick={() => window.print()}
          className="h-10 px-6 rounded-xl border-card-border gap-2 font-bold"
        >
          <Printer className="w-4 h-4" /> Cetak Laporan
        </Button>
      </div>

      {/* PAPER PREVIEW */}
      <div className="bg-white shadow-2xl rounded-sm border border-slate-200 mx-auto max-w-[210mm] min-h-[297mm] p-[20mm] text-slate-900 print:shadow-none print:border-none print:m-0 print:p-0">
        
        {/* KOP SURAT */}
        <div className="flex items-start justify-between border-b-4 border-double border-slate-800 pb-6 mb-8">
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
        <div className="text-center mb-10">
          <h2 className="text-xl font-bold uppercase underline decoration-slate-300 underline-offset-8">Laporan Transaksi Penjualan</h2>
          <p className="text-xs text-slate-500 mt-3 font-medium">
            Periode: {startDate ? format(new Date(startDate), "dd MMMM yyyy", { locale: id }) : "Semua Waktu"} s/d {endDate ? format(new Date(endDate), "dd MMMM yyyy", { locale: id }) : "Sekarang"}
          </p>
        </div>

        {/* TABEL DATA */}
        <table className="w-full text-[10px] border-collapse mb-10">
          <thead>
            <tr className="bg-slate-50 border-y border-slate-200">
              <th className="py-3 px-2 text-left border-x border-slate-200">NO</th>
              <th className="py-3 px-2 text-left border-x border-slate-200">TANGGAL</th>
              <th className="py-3 px-2 text-left border-x border-slate-200">PELANGGAN</th>
              <th className="py-3 px-2 text-left border-x border-slate-200">PAKET WISATA</th>
              <th className="py-3 px-2 text-center border-x border-slate-200">PAX</th>
              <th className="py-3 px-2 text-right border-x border-slate-200">TOTAL BAYAR</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400 italic">Tidak ada data transaksi ditemukan</td>
              </tr>
            ) : (
              data.map((b, i) => (
                <tr key={b.id} className="border-b border-slate-100">
                  <td className="py-2.5 px-2 border-x border-slate-100">{i + 1}</td>
                  <td className="py-2.5 px-2 border-x border-slate-100">{format(new Date(b.createdAt), "dd/MM/yyyy")}</td>
                  <td className="py-2.5 px-2 border-x border-slate-100 font-bold">{b.name}</td>
                  <td className="py-2.5 px-2 border-x border-slate-100">{(b.package?.title as any)?.id || "-"}</td>
                  <td className="py-2.5 px-2 border-x border-slate-100 text-center">{b.pax}</td>
                  <td className="py-2.5 px-2 border-x border-slate-100 text-right font-bold">Rp {Number(b.amountPaid).toLocaleString("id-ID")}</td>
                </tr>
              ))
            )}
          </tbody>
          <tfoot>
            <tr className="bg-slate-50 font-black text-xs">
              <td colSpan={5} className="py-3 px-2 text-right border border-slate-200">TOTAL PENDAPATAN</td>
              <td className="py-3 px-2 text-right border border-slate-200 text-primary-600">Rp {totalRevenue.toLocaleString("id-ID")}</td>
            </tr>
          </tfoot>
        </table>

        {/* TANDA TANGAN */}
        <div className="flex justify-end mt-20">
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
          Dicetak otomatis oleh Sistem Informasi Titan Travel • Halaman 1 dari 1
        </div>
      </div>
    </div>
  );
}
