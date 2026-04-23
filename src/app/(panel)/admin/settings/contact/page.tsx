import { getSetting } from "@/lib/actions/settings";
import { ContactForm } from "./ContactForm";

interface RawContactData {
  id?: Record<string, string>;
  en?: Record<string, string>;
  ms?: Record<string, string>;
}

export default async function ContactPage() {
  const raw = (await getSetting("contact")) as RawContactData | null;

  const initial = {
    // Global/Non-translatable for now or can be per-locale if needed
    whatsapp: raw?.id?.whatsapp || raw?.en?.whatsapp || "628123456789",
    email: raw?.id?.email || raw?.en?.email || "titan@gmail.com",
    mapsEmbed: raw?.id?.mapsEmbed || raw?.en?.mapsEmbed || "",
    
    // Translations
    id: {
      badge: raw?.id?.badge || "",
      title1: raw?.id?.title1 || "",
      title2: raw?.id?.title2 || "",
      subtitle: raw?.id?.subtitle || "",
      address: raw?.id?.address || "",
      officeHours: raw?.id?.officeHours || "",
    },
    en: {
      badge: raw?.en?.badge || "",
      title1: raw?.en?.title1 || "",
      title2: raw?.en?.title2 || "",
      subtitle: raw?.en?.subtitle || "",
      address: raw?.en?.address || "",
      officeHours: raw?.en?.officeHours || "",
    },
    ms: {
      badge: raw?.ms?.badge || "",
      title1: raw?.ms?.title1 || "",
      title2: raw?.ms?.title2 || "",
      subtitle: raw?.ms?.subtitle || "",
      address: raw?.ms?.address || "",
      officeHours: raw?.ms?.officeHours || "",
    }
  };

  return <ContactForm initial={initial} />;
}
