import { useRevalidator } from "@remix-run/react";
import { useEffect } from "react";
import { useSupabase } from "~/lib/supabase";

export function useRealtime(tables: string[]) {
  const { supabase } = useSupabase();
  const revalidator = useRevalidator();
  useEffect(() => {
    if (!supabase) return;
    const channel = supabase.channel(`${tables.join(",")}:*}`);

    tables.forEach((table) => {
      channel.on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: table,
        },
        revalidator.revalidate
      );
    });

    channel.subscribe();

    return () => {
      if (channel) supabase?.removeChannel(channel);
    };
  }, [revalidator.revalidate, supabase, tables]);
}
