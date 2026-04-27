import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://titantravel.co.id";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const packages = await prisma.tourPackage.findMany({
    where: { isPublished: true },
    select: { slug: true, updatedAt: true },
  });

  const packageEntries: MetadataRoute.Sitemap = packages.map((pkg) => ({
    url: `${BASE_URL}/paket/${pkg.slug}`,
    lastModified: pkg.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/paket`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...packageEntries,
  ];
}
