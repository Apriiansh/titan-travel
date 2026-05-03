import { getPackages } from "@/lib/actions/packages";
import { getActiveVehicleTypes } from "@/lib/actions/vehicle-types";
import { PackagesClient } from "./PackagesClient";

interface MultiLang {
  id: string;
  en: string;
  ms: string;
}

export default async function PackagesPage() {
  const [packages, vehicleTypes] = await Promise.all([
    getPackages(),
    getActiveVehicleTypes(),
  ]);
  
  // Serialize Decimal → number for client boundary and map locales
  const serialized = packages.map((p) => {
    const t = (p.title as unknown as MultiLang) || { id: "", en: "", ms: "" };
    const d = (p.description as unknown as MultiLang) || { id: "", en: "", ms: "" };
    const l = (p.location as unknown as MultiLang) || { id: "", en: "", ms: "" };
    const dur = (p.duration as unknown as MultiLang) || { id: "", en: "", ms: "" };
    const cap = (p.capacity as unknown as MultiLang) || { id: "", en: "", ms: "" };

    return {
      ...p,
      price: Number(p.price),
      originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
      title: t,
      description: d,
      location: l,
      duration: dur,
      capacity: cap,
      images: p.images as string[],
    };
  });

  return <PackagesClient initialPackages={serialized} vehicleTypes={vehicleTypes} />;
}
