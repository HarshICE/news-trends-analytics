"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase-browser";

export default function RealtimeListener() {
  const router = useRouter();
  const timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const refreshDashboard = () => {
      // Debounce refreshes
      if (timer.current) {
        clearTimeout(timer.current);
      }

      timer.current = setTimeout(() => {
        console.log("Realtime update received");
        router.refresh();
      }, 2000);
    };

    const channel = supabaseBrowser
      .channel("dashboard-updates")

      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "articles",
        },
        refreshDashboard
      )

      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "trends",
        },
        refreshDashboard
      )

      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "google_trends",
        },
        refreshDashboard
      )

      .subscribe((status) => {
        console.log("Realtime status:", status);
      });

    return () => {
      if (timer.current) clearTimeout(timer.current);
      supabaseBrowser.removeChannel(channel);
    };
  }, [router]);

  return null;
}