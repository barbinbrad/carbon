import { getSupabaseAdmin } from "~/lib/supabase";

export async function loader() {
  try {
    const test = await getSupabaseAdmin()
      .from("users")
      .select("id", { head: true })
      .single();
    if (test.error) throw test.error;
    return new Response("OK");
  } catch (error: unknown) {
    // eslint-disable-next-line no-console
    console.log("healthcheck ❌", { error });
    return new Response("ERROR", { status: 500 });
  }
}
