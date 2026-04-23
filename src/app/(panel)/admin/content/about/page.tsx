import { getSetting } from "@/lib/actions/settings";
import { AboutForm } from "./AboutForm";

interface LocaleAboutData {
  badge?: string;
  title1?: string;
  title2?: string;
  desc1?: string;
  desc2?: string;
  yearsCard?: string;
  imageUrl?: string;
}

interface RawAboutData {
  id?: LocaleAboutData;
  en?: LocaleAboutData;
  ms?: LocaleAboutData;
}

export default async function AboutPage() {
  const raw = (await getSetting("about")) as RawAboutData | null;

  const initial = {
    imageUrl: raw?.id?.imageUrl || raw?.en?.imageUrl || "",
    id: {
      badge:     raw?.id?.badge     || "",
      title1:    raw?.id?.title1    || "",
      title2:    raw?.id?.title2    || "",
      desc1:     raw?.id?.desc1     || "",
      desc2:     raw?.id?.desc2     || "",
      yearsCard: raw?.id?.yearsCard || "",
    },
    en: {
      badge:     raw?.en?.badge     || "",
      title1:    raw?.en?.title1    || "",
      title2:    raw?.en?.title2    || "",
      desc1:     raw?.en?.desc1     || "",
      desc2:     raw?.en?.desc2     || "",
      yearsCard: raw?.en?.yearsCard || "",
    },
    ms: {
      badge:     raw?.ms?.badge     || "",
      title1:    raw?.ms?.title1    || "",
      title2:    raw?.ms?.title2    || "",
      desc1:     raw?.ms?.desc1     || "",
      desc2:     raw?.ms?.desc2     || "",
      yearsCard: raw?.ms?.yearsCard || "",
    },
  };

  return <AboutForm initial={initial} />;
}
