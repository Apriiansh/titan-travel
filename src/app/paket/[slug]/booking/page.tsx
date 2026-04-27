import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { BookingClient } from "./BookingClient";
import { getActiveBankAccounts } from "@/lib/actions/bank-accounts";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowLeft, Users, Clock, MapPin } from "lucide-react";

export default async function BookingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await getSession();

  const [pkg, settings, bankAccounts] = await Promise.all([
    prisma.tourPackage.findUnique({
      where: { slug },
      include: { priceTiers: { orderBy: { minPax: "asc" } } },
    }),
    prisma.setting.findMany(),
    getActiveBankAccounts(),
  ]);

  if (!pkg || !pkg.isPublished) notFound();

  const settingsObj = settings.reduce((acc: any, s) => {
    acc[s.key] = s.value;
    return acc;
  }, {});

  const title = (pkg.title as any)?.id || "Paket Wisata";
  const location = (pkg.location as any)?.id || "";
  const duration = (pkg.duration as any)?.id || "";

  return (
    <>
      <Navbar data={settingsObj.navbar || {}} />
      <main className="min-h-screen bg-background">
        {/* Dark Slate Header */}
        <section className="relative bg-slate-900 pt-24 sm:pt-32 pb-12">
          <div className="absolute top-0 right-0 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 relative z-10">
            <Link
              href={`/paket/${slug}`}
              className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm font-medium transition-colors group mb-8"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Kembali ke Detail Paket
            </Link>

            <div className="space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-500/20 border border-primary-500/40 text-primary-400 text-[10px] font-bold uppercase tracking-widest">
                Form Pemesanan
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold text-white font-(family-name:--font-playfair) leading-tight">
                {title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                {location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-primary-400" />
                    {location}
                  </div>
                )}
                {duration && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-primary-400" />
                    {duration}
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-primary-400" />
                  Kapasitas {pkg.capacity} peserta
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="bg-background rounded-t-[40px] -mt-8 relative z-10 border-t border-card-border">
          <div className="max-w-7xl mx-auto px-4 py-10">
            <BookingClient 
              packageData={JSON.parse(JSON.stringify(pkg))} 
              session={session}
              bankAccounts={JSON.parse(JSON.stringify(bankAccounts))}
              adminPhone={(settingsObj.contact as any)?.id?.whatsapp || "085268111110"}
            />
          </div>
        </section>
      </main>
      <Footer data={settingsObj.footer || {}} />
    </>
  );
}
