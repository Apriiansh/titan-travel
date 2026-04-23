import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { BookingClient } from "./BookingClient";
import { PageHeader } from "@/components/panel/PageHeader";

export default async function BookingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const pkg = await prisma.tourPackage.findUnique({
    where: { slug },
    include: { priceTiers: { orderBy: { minPax: "asc" } } },
  });

  if (!pkg) notFound();

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Booking Paket</h1>
        <p className="text-muted-foreground mb-8">
          Selesaikan detail perjalanan Anda untuk paket {(pkg.title as any).id}
        </p>

        <BookingClient packageData={JSON.parse(JSON.stringify(pkg))} />
      </div>
    </div>
  );
}
