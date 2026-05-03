import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { BookingClient } from "./BookingClient";
import { getActiveBankAccounts } from "@/lib/actions/bank-accounts";
import { getActiveVehicleTypes } from "@/lib/actions/vehicle-types";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default async function BookingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await getSession();

  const [pkg, settings, bankAccounts, vehicleTypes] = await Promise.all([
    prisma.tourPackage.findUnique({
      where: { slug },
      include: {
        priceTiers: {
          orderBy: { minPax: "asc" },
          include: { vehicleType: { select: { id: true, name: true } } },
        },
      },
    }),
    prisma.setting.findMany(),
    getActiveBankAccounts(),
    getActiveVehicleTypes(),
  ]);

  if (!pkg || !pkg.isPublished) notFound();

  const settingsObj = settings.reduce((acc: any, s) => {
    acc[s.key] = s.value;
    return acc;
  }, {});

  return (
    <>
      <Navbar data={settingsObj.navbar || {}} />
      <main className="min-h-screen bg-background">
        <BookingClient 
          packageData={JSON.parse(JSON.stringify(pkg))} 
          session={session}
          bankAccounts={JSON.parse(JSON.stringify(bankAccounts))}
          vehicleTypes={JSON.parse(JSON.stringify(vehicleTypes))}
          adminPhone={(settingsObj.contact as any)?.id?.whatsapp || "085268111110"}
          slug={slug}
        />
      </main>
      <Footer data={settingsObj.footer || {}} />
    </>
  );
}
