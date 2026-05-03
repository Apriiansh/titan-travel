import { getSession } from "@/lib/auth";
import { getManagerDashboardStats } from "@/lib/actions/dashboard";
import { ManagerDashboardClient } from "./ManagerDashboardClient";

export default async function ManagerDashboardPage() {
  const session = await getSession();
  const stats = await getManagerDashboardStats();

  return (
    <ManagerDashboardClient 
      initialStats={stats} 
      userName={(session?.name as string) || "Manager"} 
    />
  );
}
