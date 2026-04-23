import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PackagesSection from "@/components/PackagesSection";
import Link from "next/link";
import { ArrowLeft, MapPin, Star, Compass } from "lucide-react";

export default async function AllPackagesPage() {
  const packages = await prisma.tourPackage.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
  });

  const settings = await prisma.setting.findMany();
  const settingsObj = settings.reduce((acc: any, s) => {
    acc[s.key] = s.value;
    return acc;
  }, {});

  const totalPackages = packages.length;

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar data={settingsObj} />

      {/* ── Hero Section ── */}
      <section className="relative h-[480px] w-full overflow-hidden flex items-end">
        {/* Background image */}
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073"
          className="absolute inset-0 w-full h-full object-cover"
          alt="Packages Hero"
        />

        <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/55 to-slate-900/30" />

        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="container mx-auto px-4 relative z-10 pb-12">
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Kembali ke Beranda
            </Link>
          </div>

          {/* Badge */}
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-500/20 border border-primary-500/40 text-primary-400 text-xs font-bold backdrop-blur-sm">
              <Compass className="w-3 h-3" />
              Explore Our Catalog
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3 leading-tight font-(family-name:--font-playfair)">
            Semua{" "}
            <span className="text-primary-400 italic">Paket Wisata</span>
          </h1>

          <p className="text-slate-300 max-w-xl text-base leading-relaxed mb-6">
            Temukan berbagai pilihan destinasi terbaik mulai dari wisata alam,
            budaya, hingga petualangan seru yang tak terlupakan.
          </p>

          {/* Stats chips */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/15 rounded-full px-4 py-2">
              <MapPin className="w-3.5 h-3.5 text-primary-400" />
              <span className="text-white text-xs font-bold">
                {totalPackages} Paket Tersedia
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/15 rounded-full px-4 py-2">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="text-white text-xs font-bold">
                Terpercaya & Berpengalaman
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Packages Content ── */}
      <section className="pb-24">
        {/* Top divider bar with result count */}
        <div className="bg-white border-b border-slate-100 sticky top-0 z-20 shadow-sm">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Menampilkan{" "}
              <span className="font-bold text-slate-800">{totalPackages}</span>{" "}
              paket wisata
            </p>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-slate-400 font-medium">
                Diperbarui hari ini
              </span>
            </div>
          </div>
        </div>

        {/* Package grid from component */}
        <div className="pt-4">
          <PackagesSection
            dbData={packages}
            settingsData={settingsObj}
            limit={null}
            hideViewAll={true}
          />
        </div>
      </section>

      <Footer data={settingsObj} />
    </main>
  );
}