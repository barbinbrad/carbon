import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { arrayToTree } from "performant-array-to-tree";
import { getSupabase } from "~/lib/supabase";
import type { Group } from "~/modules/Users/types";
import { requireAuthSession, setSessionFlash } from "~/services/session";

export async function loader({ request }: LoaderArgs) {
  const { accessToken } = await requireAuthSession(request);
  const client = getSupabase(accessToken);

  const groups = await client.from("groups_view").select("*");
  if (groups.error) {
    return json(
      { groups: [], error: groups.error },
      await setSessionFlash(request, {
        success: false,
        message: "Failed to load groups",
      })
    );
  }

  return json({
    groups: arrayToTree(groups.data) as Group[],
  });
}
