import { useRevalidator } from "@remix-run/react";
import { useEffect } from "react";
import { useSupabase } from "~/lib/supabase";

export function useRealtime(table: string, filter?: string) {
  const { accessToken, supabase } = useSupabase();
  const revalidator = useRevalidator();
  useEffect(() => {
    if (!supabase || !accessToken) return;
    const channel = supabase
      .channel(`postgres_changes:${table}}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: table,
          filter: filter,
        },
        revalidator.revalidate
      )
      .subscribe();

    return () => {
      if (channel) supabase?.removeChannel(channel);
    };
  }, [revalidator.revalidate, supabase, table, filter, accessToken]);
}
