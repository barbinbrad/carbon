import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { requirePermissions } from "~/services/auth";
import type { PartReplenishmentSystem } from "~/modules/parts";
import { getPartsList } from "~/modules/parts";
import { flash } from "~/services/session";
import { error } from "~/utils/result";

export async function loader({ request }: LoaderArgs) {
  const authorized = await requirePermissions(request, {});

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const replenishmentSystem = searchParams.get(
    "replenishmentSystem"
  ) as PartReplenishmentSystem | null;

  const parts = await getPartsList(authorized.client, replenishmentSystem);
  if (parts.error) {
    return json(
      parts,
      await flash(request, error(parts.error, "Failed to get parts"))
    );
  }

  return json(parts);
}
