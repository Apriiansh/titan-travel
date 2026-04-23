/**
 * Shared types for the CMS admin panel.
 * Single source of truth for multi-language content management.
 */

export type Locale = "en" | "id" | "ms";

export const LOCALES: Locale[] = ["en", "id", "ms"];

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  id: "Indonesia",
  ms: "Malaysia",
};
