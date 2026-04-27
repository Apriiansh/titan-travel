import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CatalogClient from "./CatalogClient";
import { getPackages } from "@/lib/actions/packages";
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
  const [allPackages, settingsObj] = await Promise.all([
    getPackages(),
    getSettings(),
  ]);

  const packages = allPackages.filter((p: any) => p.isPublished);

  const totalPackages = packages.length;
  const serializedPackages = JSON.parse(JSON.stringify(packages));

  return (
    <>
      <Navbar data={settingsObj} />
      <CatalogClient 
        packages={serializedPackages} 
        settingsObj={settingsObj} 
        totalPackages={totalPackages} 
      />
      <Footer data={settingsObj} />
    </>
  );
}