import { useRevalidator } from "@remix-run/react";
import { useEffect } from "react";
import { useSupabase } from "~/lib/supabase";

export function useRealtime(tables: string[]) {
  const { supabase } = useSupabase();
  const revalidator = useRevalidator();
  useEffect(() => {
    if (!supabase) return;
    const subscriptions = supabase.channel("changes");

    tables.forEach((table) => {
      subscriptions.on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: table,
        },
        revalidator.revalidate
      );
    });

    const channel = subscriptions.subscribe();

    return () => {
      if (channel) supabase?.removeChannel(channel);
    };
  }, [revalidator.revalidate, supabase, tables]);
}
