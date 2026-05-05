"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
    startTransition
} from "react";

export type Locale = "en" | "id" | "ms";

interface LocaleContextValue {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    // Currency Rates
    rates: {
        USD: number; // 1 USD in IDR
        MYR: number; // 1 MYR in IDR
        USD_TO_MYR: number; // 1 USD in MYR
        loading: boolean;
    };
    // Helper to get string from { en, id, ms } object based on current locale
    dt: (data: Record<string, any> | string | unknown, fallback?: string) => string;
    // Helper to get the FULL locale sub-object (for nested arrays/objects like stats, services)
    dObj: <T = Record<string, any>>(data: Record<string, any> | null | undefined) => T;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>("en");
    const [rates, setRates] = useState({
        USD: 16000, 
        MYR: 3500,  
        USD_TO_MYR: 4.7,
        loading: true
    });

    useEffect(() => {
        const fetchRates = async () => {
            try {
                // Fetch rates based on IDR (since our DB uses IDR as base)
                const response = await fetch("https://open.er-api.com/v6/latest/IDR");
                const resData = await response.json();
                
                if (resData && resData.rates) {
                    const usdInIdr = 1 / resData.rates.USD;
                    const myrInIdr = 1 / resData.rates.MYR;
                    
                    setRates({
                        USD: usdInIdr,
                        MYR: myrInIdr,
                        USD_TO_MYR: resData.rates.MYR / resData.rates.USD, // USD to MYR
                        loading: false
                    });
                }
            } catch (err) {
                console.error("Failed to fetch exchange rates", err);
                setRates(prev => ({ ...prev, loading: false }));
            }
        };
        fetchRates();
    }, []);

    const setLocale = (newLocale: Locale) => {
        startTransition(() => {
            setLocaleState(newLocale);
        });
    };

    // dt = Dynamic Translate helper (returns string)
    const dt = (data: Record<string, any> | string | unknown, fallback = ""): string => {
        if (!data) return fallback;
        if (typeof data === "string") return data;
        
        const obj = data as Record<string, any>;
        if (obj[locale]) return obj[locale];
        if (obj["en"]) return obj["en"]; // fallback to EN
        if (obj["id"]) return obj["id"]; // fallback to ID
        return fallback;
    };

    // dObj = Dynamic Object helper (returns full locale sub-object for nested data)
    const dObj = <T = Record<string, any>>(data: Record<string, any> | null | undefined): T => {
        if (!data) return {} as T;
        return (data[locale] ?? data["en"] ?? data["id"] ?? {}) as T;
    };

    return (
        <LocaleContext.Provider value={{ locale, setLocale, dt, dObj, rates }}>
            {children}
        </LocaleContext.Provider>
    );
}

export function useLocale(): LocaleContextValue {
    const ctx = useContext(LocaleContext);
    if (!ctx) throw new Error("useLocale must be used within a LocaleProvider");
    return ctx;
}

