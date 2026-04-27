import { getSetting } from "@/lib/actions/settings";
import { GlobalSettingsForm } from "./GlobalSettingsForm";

interface RawGlobalData {
  id?: Record<string, string>;
  en?: Record<string, string>;
  ms?: Record<string, string>;
}

export default async function SettingsPage() {
  const raw = (await getSetting("global")) as RawGlobalData | null;

  const initial = {
    siteName: raw?.id?.siteName || raw?.en?.siteName || "Titan Travel",
    logoUrl: raw?.id?.logoUrl || raw?.en?.logoUrl || "",
    faviconUrl: raw?.id?.faviconUrl || raw?.en?.faviconUrl || "",
    
    id: {
      siteTagline: raw?.id?.siteTagline || "",
      metaDesc: raw?.id?.metaDesc || "",
    },
    en: {
      siteTagline: raw?.en?.siteTagline || "",
      metaDesc: raw?.en?.metaDesc || "",
    },
    ms: {
      siteTagline: raw?.ms?.siteTagline || "",
      metaDesc: raw?.ms?.metaDesc || "",
    }
  };

  return <GlobalSettingsForm initial={initial} />;
}
