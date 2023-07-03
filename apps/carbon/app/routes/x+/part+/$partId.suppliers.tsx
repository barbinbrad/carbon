import type { LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getPartSuppliers, PartSuppliers } from "~/modules/parts";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { error } from "~/utils/result";

export async function loader({ request, params }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    view: "parts",
  });

  const { partId } = params;
  if (!partId) throw new Error("Could not find partId");

  const [partSuppliers] = await Promise.all([getPartSuppliers(client, partId)]);

  if (partSuppliers.error) {
    return redirect(
      `/x/part/${partId}`,
      await flash(
        request,
        error(partSuppliers.error, "Failed to load part suppliers")
      )
    );
  }

  return json({
    partSuppliers: partSuppliers.data ?? [],
  });
}

export default function PartSuppliersRoute() {
  const { partSuppliers } = useLoaderData<typeof loader>();

  return <PartSuppliers partSuppliers={partSuppliers} />;
}
