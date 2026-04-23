import { getTopsisAnalysis } from "@/lib/actions/topsis";
import { TopsisAnalysisClient } from "@/components/panel/TopsisAnalysisClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analisis Rekomendasi TOPSIS | Titan Admin",
  description: "Dashboard analisis perankingan paket wisata menggunakan metode TOPSIS",
};

export default async function AdminTopsisPage() {
  // Fetch initial data directly on the server
  const data = await getTopsisAnalysis();

  return (
    <div className="w-full px-4 py-8">
      <TopsisAnalysisClient initialData={data} />
    </div>
  );
}
