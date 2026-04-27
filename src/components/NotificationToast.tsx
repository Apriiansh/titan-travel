"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { getUnreadNotifications, markAsRead } from "@/lib/actions/notifications";
import { useRouter } from "next/navigation";

interface NotificationToastProps {
  userId: string;
  role?: string;
}

export function NotificationToast({ userId, role }: NotificationToastProps) {
  const hasFetched = useRef(false);
  const router = useRouter();

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    (async () => {
      try {
        const notifications = await getUnreadNotifications(userId, role);
        if (notifications.length === 0) return;

        for (const notif of notifications) {
          const type = notif.type;
          const toastFn =
            type === "PAYMENT_VERIFIED"
              ? toast.success
              : type === "BOOKING_NEW" || type === "PAYMENT_PROOF"
                ? toast.info
                : toast;

          toastFn(notif.title, {
            description: notif.message,
            action: notif.linkUrl
              ? {
                  label: "Lihat",
                  onClick: () => router.push(notif.linkUrl!),
                }
              : undefined,
            onAutoClose: () => markAsRead(notif.id),
            onDismiss: () => markAsRead(notif.id),
          });
        }
      } catch {
        // Silently fail — notif fetch bukan critical
      }
    })();
  }, [userId, role, router]);

  return null;
}
