import { getGalleryImages } from "@/lib/actions/gallery";
import { GalleryClient } from "./GalleryClient";

interface MultiLang {
  id: string;
  en: string;
  ms: string;
}

export default async function GalleryPage() {
  const data = await getGalleryImages();
  const serialized = data.map((img) => ({
    ...img,
    title: (img.title as unknown as MultiLang) || { id: "", en: "", ms: "" },
    category: (img.category as unknown as MultiLang) || { id: "", en: "", ms: "" },
  }));
  return <GalleryClient initialData={serialized} />;
}
