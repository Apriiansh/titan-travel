import { getSetting } from "@/lib/actions/settings";
import { HeroForm } from "./HeroForm";

interface StatItem {
  label: string;
  value: string;
}

interface LocaleHeroData {
  badge?: string;
  title1?: string;
  title2?: string;
  subtitle?: string;
  cta1?: string;
  cta2?: string;
  stats?: StatItem[];
  imageUrl?: string;
}

interface RawHeroData {
  id?: LocaleHeroData;
  en?: LocaleHeroData;
  ms?: LocaleHeroData;
}

const DEFAULT_STATS: StatItem[] = [
  { value: "500+", label: "Happy Travelers" },
  { value: "10+", label: "Years Experience" },
  { value: "50+", label: "Destinations" },
  { value: "4.9★", label: "Service Rating" },
];

export default async function HeroPage() {
  const raw = (await getSetting("hero")) as RawHeroData | null;

  const initial = {
    imageUrl: raw?.id?.imageUrl || raw?.en?.imageUrl || "",
    id: {
      badge: raw?.id?.badge || "",
      title1: raw?.id?.title1 || "",
      title2: raw?.id?.title2 || "",
      subtitle: raw?.id?.subtitle || "",
      cta1: raw?.id?.cta1 || "",
      cta2: raw?.id?.cta2 || "",
      stats: raw?.id?.stats || DEFAULT_STATS,
    },
    en: {
      badge: raw?.en?.badge || "",
      title1: raw?.en?.title1 || "",
      title2: raw?.en?.title2 || "",
      subtitle: raw?.en?.subtitle || "",
      cta1: raw?.en?.cta1 || "",
      cta2: raw?.en?.cta2 || "",
      stats: raw?.en?.stats || DEFAULT_STATS,
    },
    ms: {
      badge: raw?.ms?.badge || "",
      title1: raw?.ms?.title1 || "",
      title2: raw?.ms?.title2 || "",
      subtitle: raw?.ms?.subtitle || "",
      cta1: raw?.ms?.cta1 || "",
      cta2: raw?.ms?.cta2 || "",
      stats: raw?.ms?.stats || DEFAULT_STATS,
    },
  };

  return <HeroForm initial={initial} />;
}
