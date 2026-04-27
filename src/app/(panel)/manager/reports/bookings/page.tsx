import { getBookingReport } from "@/lib/actions/reports";
import { ReportBookingsClient } from "./ReportBookingsClient";

export const metadata = {
  title: "Laporan Transaksi | Manager Titan Travel",
  description: "Cetak laporan transaksi penjualan tiket Titan Travel",
};

export default async function BookingReportPage() {
  const initialData = await getBookingReport();
  
  return <ReportBookingsClient initialData={initialData} />;
}
