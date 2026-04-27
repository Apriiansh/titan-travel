"use client";

import { useState, useEffect } from "react";
import { Timer, AlertTriangle } from "lucide-react";

interface CountdownTimerProps {
  deadline: string | Date;
  onExpired?: () => void;
}

export function CountdownTimer({ deadline, onExpired }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(() => calcTimeLeft(deadline));

  useEffect(() => {
    const interval = setInterval(() => {
      const left = calcTimeLeft(deadline);
      setTimeLeft(left);
      if (left.total <= 0) {
        clearInterval(interval);
        onExpired?.();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [deadline, onExpired]);

  if (timeLeft.total <= 0) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-50 border border-red-200 text-red-600">
        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
        <span className="text-[11px] font-bold">Batas waktu pembayaran telah habis</span>
      </div>
    );
  }

  const isUrgent = timeLeft.total < 60 * 60 * 1000;

  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${
        isUrgent
          ? "bg-red-50 border-red-200 text-red-600"
          : "bg-amber-50 border-amber-200 text-amber-700"
      }`}
    >
      <Timer className="w-3.5 h-3.5 shrink-0" />
      <span className="text-[11px] font-bold">
        Bayar dalam{" "}
        <span className="font-mono tabular-nums">
          {timeLeft.hours.toString().padStart(2, "0")}:
          {timeLeft.minutes.toString().padStart(2, "0")}:
          {timeLeft.seconds.toString().padStart(2, "0")}
        </span>
      </span>
    </div>
  );
}

function calcTimeLeft(deadline: string | Date) {
  const diff = new Date(deadline).getTime() - Date.now();
  if (diff <= 0) return { total: 0, hours: 0, minutes: 0, seconds: 0 };

  return {
    total: diff,
    hours: Math.floor(diff / (1000 * 60 * 60)),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}
