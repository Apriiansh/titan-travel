import { getSession } from "@/lib/auth";
import { getBookingsByUser } from "@/lib/actions/bookings";
import { redirect } from "next/navigation";
import { DashboardClient } from "./DashboardClient";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await getSession();

  if (!session || !session.id) {
    redirect("/login");
  }

  const bookings = await getBookingsByUser(session.id as string);
  const settings = await prisma.setting.findMany();
  
  const getSetting = (key: string) => {
    const s = settings.find(s => s.key === key);
    return s?.value || {};
  }

  return (
    <>
      <Navbar data={getSetting("navbar")} />
      <main className="min-h-screen bg-background">
        {/* Dark Header Background for Transparent Navbar */}
        <div className="absolute top-0 left-0 w-full h-75 bg-slate-900 -z-10" />
        
        <div className="pt-16 sm:pt-20">
          <DashboardClient
            initialBookings={bookings}
            userName={session.name as string}
            adminPhone={(getSetting("contact") as any)?.id?.whatsapp || "085268111110"}
          />
        </div>
      </main>
      <Footer data={getSetting("footer")} />
    </>
  );
}

