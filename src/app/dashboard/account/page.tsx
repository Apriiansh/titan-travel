import { getAccountData } from "@/lib/actions/account";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AccountClient } from "@/components/panel/AccountClient";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";

export default async function DashboardAccountPage() {
  const session = await getSession();
  if (!session?.id) redirect("/login");

  const user = await getAccountData();
  if (!user) redirect("/login");

  const settings = await prisma.setting.findMany();
  const getSetting = (key: string) => {
    const s = settings.find((s) => s.key === key);
    return s?.value || {};
  };

  return (
    <>
      <Navbar data={getSetting("navbar")} />
      <main className="min-h-screen bg-background">
        <div className="absolute top-0 left-0 w-full h-75 bg-slate-900 -z-10" />
        <div className="pt-28 sm:pt-32 pb-16 px-4 max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-foreground font-(family-name:--font-playfair) mb-2">
            Akun Saya
          </h1>
          <p className="text-sm text-foreground-secondary mb-6">
            Kelola profil dan keamanan akun Anda.
          </p>
          <AccountClient user={user} />
        </div>
      </main>
      <Footer data={getSetting("footer")} />
    </>
  );
}
