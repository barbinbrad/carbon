import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { arrayToTree } from "performant-array-to-tree";
import type { Group } from "~/modules/Users/types";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { error } from "~/utils/result";

export async function loader({ request }: LoaderArgs) {
  const { client } = await requirePermissions(request, {});

  const groups = await client.from("groups_view").select("*");
  if (groups.error) {
    return json(
      { groups: [], error: groups.error },
      await flash(request, error(groups.error, "Failed to load groups"))
    );
  }

  return json({
    groups: arrayToTree(groups.data) as Group[],
  });
}
