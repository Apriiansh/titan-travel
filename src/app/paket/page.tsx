import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CatalogClient from "./CatalogClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Semua Paket Wisata | Titan Travel",
  description:
    "Jelajahi koleksi paket wisata domestik & internasional dari Titan Travel. Tour Palembang, Umroh, Corporate Gathering, Family Trip & lainnya.",
  openGraph: {
    title: "Paket Wisata - Titan Travel",
    description:
      "Koleksi paket wisata terbaik dari Titan Travel Palembang. Booking online mudah dan terpercaya.",
    type: "website",
    locale: "id_ID",
  },
};

async function getSettings() {
  const settings = await prisma.setting.findMany();
  return settings.reduce((acc: any, s) => {
    acc[s.key] = s.value;
    return acc;
  }, {});
}

export default async function AllPackagesPage() {
  const [packages, settingsObj] = await Promise.all([
    prisma.tourPackage.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
    }),
    getSettings(),
  ]);

  const totalPackages = packages.length;

  return (
    <>
      <Navbar data={settingsObj} />
      <CatalogClient 
        packages={packages} 
        settingsObj={settingsObj} 
        totalPackages={totalPackages} 
      />
      <Footer data={settingsObj} />
    </>
  );
}