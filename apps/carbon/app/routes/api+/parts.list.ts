import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { PartReplenishmentSystem } from "~/modules/parts";
import { getPartsList } from "~/modules/parts";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { error } from "~/utils/result";

export async function loader({ request }: LoaderFunctionArgs) {
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
