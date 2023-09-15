import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getNextSequence } from "~/modules/settings";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { error } from "~/utils/result";

export async function loader({ request }: LoaderArgs) {
  const { client, userId } = await requirePermissions(request, {});

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const table = searchParams.get("table") as string;

  if (!table || table === "undefined")
    return json(
      { data: null },
      await flash(request, error(request, "Bad request for next sequence"))
    );

  const nextSequence = await getNextSequence(client, table, userId);
  if (nextSequence.error) {
    return json(
      nextSequence,
      await flash(
        request,
        error(nextSequence.error, `Failed to get next sequence for ${table}`)
      )
    );
  }

  return json(nextSequence);
}
