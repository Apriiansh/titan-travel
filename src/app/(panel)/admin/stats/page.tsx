import { getAdminStatsData } from "@/lib/actions/stats";
import { StatsClient } from "@/components/panel/StatsClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Statistik Travel | Titan Admin",
  description: "Dashboard statistik dan analitik Titan Travel",
};

export default async function AdminStatsPage() {
  // Fetch initial data directly on the server
  const stats = await getAdminStatsData();

  return (
    <div className="w-full">
      <StatsClient initialData={stats} />
    </div>
  );
}