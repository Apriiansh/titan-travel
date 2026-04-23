import { getSetting } from "@/lib/actions/settings";
import { ServicesForm } from "./ServicesForm";

interface ServiceItem {
  iconName?: string;
  title?: string;
  desc?: string;
}

interface RawServicesData {
  id?: { items?: ServiceItem[] };
  en?: { items?: ServiceItem[] };
  ms?: { items?: ServiceItem[] };
}

export default async function ServicesPage() {
  const raw = (await getSetting("services")) as RawServicesData | null;

  // Standardization: raw is { id: { items: [...] }, en: { items: [...] }, ms: { items: [...] } }
  const idItems = raw?.id?.items || [];
  const enItems = raw?.en?.items || [];
  const msItems = raw?.ms?.items || [];

  const maxLength = Math.max(idItems.length, enItems.length, msItems.length);
  
  const services = Array.from({ length: maxLength }).map((_, i) => ({
    iconName: idItems[i]?.iconName || enItems[i]?.iconName || "MapPin",
    titleId: idItems[i]?.title || "",
    titleEn: enItems[i]?.title || "",
    titleMs: msItems[i]?.title || "",
    descId: idItems[i]?.desc || "",
    descEn: enItems[i]?.desc || "",
    descMs: msItems[i]?.desc || "",
  }));

  return <ServicesForm initial={{ services }} />;
}
