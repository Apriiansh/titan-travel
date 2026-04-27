import { getPackageBySlug } from "@/lib/actions/packages";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { notFound } from "next/navigation";
import PackageDetailClient from "@/components/PackageDetailClient";
import type { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://titantravel.co.id";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const pkg = await prisma.tourPackage.findUnique({
    where: { slug },
    select: { title: true, description: true, images: true, location: true },
  });

  if (!pkg) return { title: "Paket Tidak Ditemukan" };

  const title = (pkg.title as any)?.id || "Paket Wisata";
  const description = (pkg.description as any)?.id || `Paket wisata ${title} dari Titan Travel`;
  const images = (pkg.images as string[]) || [];
  const location = (pkg.location as any)?.id || "";

  return {
    title: `${title} | Titan Travel`,
    description: description.substring(0, 160),
    openGraph: {
      title: `${title} - Titan Travel`,
      description: description.substring(0, 160),
      url: `${BASE_URL}/paket/${slug}`,
      images: images[0] ? [{ url: images[0], width: 1200, height: 630, alt: title }] : [],
      type: "website",
      locale: "id_ID",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Titan Travel`,
      description: description.substring(0, 160),
      images: images[0] ? [images[0]] : [],
    },
    alternates: {
      canonical: `${BASE_URL}/paket/${slug}`,
    },
    keywords: [title, location, "wisata", "tour", "travel", "Palembang", "Titan Travel"].filter(Boolean),
  };
}

export default async function PackageDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // 1. Fetch data paket
  const pkg = await getPackageBySlug(slug);
  if (!pkg) notFound();

  // 2. Fetch settings untuk Navbar & Footer
  const settings = await prisma.setting.findMany();
  const getSetting = (key: string) => settings.find(s => s.key === key)?.value || {};

  // 3. Serialize data untuk Client Component
  const serializedPkg = {
    ...pkg,
    price: Number(pkg.price),
    originalPrice: pkg.originalPrice ? Number(pkg.originalPrice) : null,
  };

  return (
    <>
      <Navbar data={getSetting("navbar")} />
      <main className="min-h-screen bg-slate-900 dark:bg-slate-950">
        <div className="pt-16 sm:pt-20">
          <PackageDetailClient pkg={serializedPkg} />
        </div>
      </main>
      <Footer data={getSetting("footer")} />
    </>
  );
}
