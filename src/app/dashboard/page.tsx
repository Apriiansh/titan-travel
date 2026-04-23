import { getSession } from "@/lib/auth";
import { getBookingsByUser } from "@/lib/actions/bookings";
import { redirect } from "next/navigation";
import { DashboardClient } from "./DashboardClient";
import Navbar from "@/components/Navbar";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";

export default async function DashboardPage() {
  const session = await getSession();

  if (!session || !session.id) {
    redirect("/login");
  }

  const bookings = await getBookingsByUser(session.id as string);
  const settings = await prisma.setting.findMany();
  const settingsObj = settings.reduce((acc: any, s) => {
    acc[s.key] = s.value;
    return acc;
  }, {});

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar data={settingsObj} />

      {/* Dark Hero Section */}
      <div className="relative h-[260px] w-full overflow-hidden flex items-center bg-slate-900 dark:bg-slate-950">
        <div className="absolute inset-0 bg-linear-to-br from-primary-900/20 to-transparent" />

        <div className="container mx-auto px-4 relative z-10 pt-10 pb-4">
          <Badge className="mb-4 bg-primary-500 hover:bg-primary-500 text-white border-none px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider">
            User Dashboard
          </Badge>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-2">
            Pesanan Saya
          </h1>
          <p className="text-slate-300 max-w-lg">
            Halo {session.name as string}, pantau semua rencana perjalanan dan
            status pembayaran Anda secara real-time.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-10 pb-20 relative z-20">
        <DashboardClient initialBookings={bookings} />
      </div>
    </main>
  );
}
