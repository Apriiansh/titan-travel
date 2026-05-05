"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";
import { useLocale } from "@/lib/LocaleContext";
import { translations } from "@/lib/translations";

interface ConfirmDialogProps {
  trigger: ReactNode;
  title?: string;
  description?: string;
  onConfirm: () => void;
}

export function ConfirmDialog({
  trigger,
  title,
  description,
  onConfirm,
}: ConfirmDialogProps) {
  const { dObj } = useLocale();
  const t = dObj(translations).adminPanel.common.deleteConfirm;

  const displayTitle = title || t?.title || "Konfirmasi Hapus";
  const displayDescription = description || t?.description || "Tindakan ini tidak dapat dibatalkan. Data akan dihapus secara permanen.";

  return (
    <AlertDialog>
      {/* Base UI Trigger — render as the trigger child element */}
      <AlertDialogTrigger render={trigger as React.ReactElement} />

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{displayTitle}</AlertDialogTitle>
          <AlertDialogDescription>{displayDescription}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t?.cancelBtn || "Batal"}</AlertDialogCancel>
          {/* Use plain Button + close via dialog open state */}
          <Button
            onClick={onConfirm}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            {t?.deleteBtn || "Hapus"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
