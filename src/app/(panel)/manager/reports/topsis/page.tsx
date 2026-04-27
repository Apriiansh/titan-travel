import { getTopsisAnalysis } from "@/lib/actions/topsis";
import { ReportTopsisClient } from "./ReportTopsisClient";

export const metadata = {
  title: "Laporan TOPSIS | Manager Titan Travel",
  description: "Cetak laporan hasil perankingan paket wisata metode TOPSIS",
};

export default async function TopsisReportPage() {
  const data = await getTopsisAnalysis();
  
  return <ReportTopsisClient data={data} />;
}
