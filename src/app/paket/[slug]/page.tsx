import { getPackageBySlug } from "@/lib/actions/packages";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { notFound } from "next/navigation";
import PackageDetailClient from "@/components/PackageDetailClient";

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
      <main className="min-h-screen bg-background">
        {/* Dark Header Background for Transparent Navbar */}
        <div className="absolute top-0 left-0 w-full h-[300px] bg-slate-900 -z-10" />
        
        <div className="pt-16 sm:pt-20">
          <PackageDetailClient pkg={serializedPkg} />
        </div>
      </main>
      <Footer data={getSetting("footer")} />
    </>
  );
}
