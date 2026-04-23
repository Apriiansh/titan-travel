"use client";

import { useState, useTransition } from "react";

/**
 * A reusable hook that encapsulates all save/dirty state logic for CMS forms.
 * Eliminates the repeated pattern of useState + useTransition + setSaved across all admin forms.
 */
export function useCmsForm<T>(initial: T) {
  const [form, setForm] = useState<T>(initial);
  const [isPending, startTransition] = useTransition();
  const [isTranslating, startTranslating] = useTransition();
  const [saved, setSaved] = useState(false);

  /**
   * Updates a single field in a locale-namespaced slice of the form.
   * Works for any form structure with { en: {...}, id: {...}, ms: {...} }
   */
  function updateLocale<L extends keyof T, K extends keyof T[L]>(
    lang: L,
    field: K,
    val: T[L][K]
  ) {
    setForm((prev) => ({
      ...prev,
      [lang]: { ...(prev[lang] as object), [field]: val },
    }));
  }

  /**
   * Wraps an async action — handles pending state and shows "Tersimpan!" for 3s after success.
   */
  function save(action: (data: T) => Promise<void>) {
    startTransition(async () => {
      await action(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    });
  }

  return {
    form,
    setForm,
    isPending,
    isTranslating,
    startTranslating,
    saved,
    save,
    updateLocale,
  };
}
