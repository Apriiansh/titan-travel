"use client";

import { Save, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SaveButtonProps {
  isPending: boolean;
  saved: boolean;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
}

/**
 * Reusable Save button with pending/saved states.
 * Replaces the identical JSX block repeated across 6+ CMS form components.
 */
export function SaveButton({ isPending, saved, onClick, className, disabled }: SaveButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={isPending || disabled}
      className={
        className ??
        "bg-primary-500 hover:bg-primary-600 text-white gap-2 rounded-md"
      }
    >
      {isPending ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : saved ? (
        <CheckCircle className="w-4 h-4" />
      ) : (
        <Save className="w-4 h-4" />
      )}
      {saved ? "Tersimpan!" : "Simpan Perubahan"}
    </Button>
  );
}
