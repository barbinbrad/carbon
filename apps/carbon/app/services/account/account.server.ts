import type { Database } from "@carbon/database";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function getAccountById(
  client: SupabaseClient<Database>,
  id: string
) {
  return client.from("user").select("*").eq("id", id).single();
}

export async function updateAvatar(
  client: SupabaseClient<Database>,
  userId: string,
  avatarUrl: string | null
) {
  return client
    .from("user")
    .update({
      avatarUrl,
    })
    .eq("id", userId);
}

export async function updatePublicAccount(
  client: SupabaseClient<Database>,
  args: {
    id: string;
    firstName: string;
    lastName: string;
    about: string;
  }
) {
  const { id, firstName, lastName, about } = args;
  return client
    .from("user")
    .update({
      firstName,
      lastName,
      about,
    })
    .eq("id", id);
}
