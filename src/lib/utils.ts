import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Locale } from "./LocaleContext"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Dynamic currency formatting with conversion using rates from context
export function formatCurrency(
  value: number, 
  locale: Locale = "id", 
  rates?: { USD: number; MYR: number }
) {
  let currency = "IDR";
  let displayValue = value;
  let localeStr = "id-ID";

  if (locale === "en") {
    currency = "USD";
    const rate = rates?.USD || 16000;
    displayValue = value / rate;
    localeStr = "en-US";
  } else if (locale === "ms") {
    currency = "MYR";
    const rate = rates?.MYR || 3500;
    displayValue = value / rate;
    localeStr = "en-MY"; // Using en-MY for RM formatting consistency
  }

  return new Intl.NumberFormat(localeStr, {
    style: "currency",
    currency: currency,
    maximumFractionDigits: locale === "id" ? 0 : 2,
  }).format(displayValue);
}
