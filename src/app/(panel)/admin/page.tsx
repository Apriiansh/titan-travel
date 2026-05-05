import { getSession } from "@/lib/auth";
import { getDashboardStats } from "@/lib/actions/dashboard";
import { AdminDashboardClient, DashboardStats } from "./AdminDashboardClient";

export default async function AdminDashboardPage() {
  const session = await getSession();
  const stats = await getDashboardStats();

  return (
    <AdminDashboardClient 
      initialStats={stats as unknown as DashboardStats} 
      userName={(session?.name as string) || "Admin"} 
    />
  );
}
