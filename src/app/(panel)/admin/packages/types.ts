export type PackageContent = {
  id: string;
  en: string;
  ms: string;
};

export type Package = {
  id: string;
  slug: string;
  title: PackageContent;
  description?: PackageContent | null;
  location: PackageContent;
  duration: PackageContent;
  capacity: number;
  price: number;
  originalPrice?: number | null;
  facilityScore: number;
  departureScore: number;
  durationDays: number;
  images: string[];
  isPublished: boolean;
  priceTiers: {
    minPax: number;
    maxPax: number;
    price: number | string;
    originalPrice?: number | string | null;
  }[];
  createdAt: Date;
};

export type PackageFormState = {
  titleId: string;
  titleEn: string;
  titleMs: string;
  descId: string;
  descEn: string;
  descMs: string;
  locationId: string;
  locationEn: string;
  locationMs: string;
  durationId: string;
  durationEn: string;
  durationMs: string;
  capacity: number;
  facilityScore: number;
  departureScore: number;
  durationDays: number;
  images: string[];
  isPublished: boolean;
  priceTiers: {
    minPax: number;
    maxPax: number;
    price: string;
    originalPrice: string;
  }[];
};
