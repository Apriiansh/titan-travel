import { getAdminStats } from "@/lib/actions/stats";
import { StatsClient } from "./StatsClient";

export const metadata = {
  title: "Statistik Bisnis | Titan Travel",
  description: "Dashboard analisis performa bisnis Titan Travel",
};

export default async function StatsPage() {
  const data = await getAdminStats();
  
  return <StatsClient data={data} />;
}