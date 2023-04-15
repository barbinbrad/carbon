import type { Database } from "@carbon/database";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function getAccountsList(client: SupabaseClient<Database>) {
  return client
    .from("account")
    .select("number, name")
    .eq("active", true)
    .order("name", { ascending: true });
}

export async function getCurrenciesList(client: SupabaseClient<Database>) {
  return client
    .from("currency")
    .select("code, name")
    .order("name", { ascending: true });
}
