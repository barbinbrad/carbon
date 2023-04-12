import { Grid } from "@chakra-ui/react";
import type { LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { getPartSummary, PartPreview, PartSidebar } from "~/modules/parts";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { error } from "~/utils/result";

export async function loader({ request, params }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    view: "parts",
  });

  const { partId } = params;
  if (!partId) throw new Error("Could not find partId");

  const partSummary = await getPartSummary(client, partId);
  if (partSummary.error) {
    return redirect(
      "/x/parts",
      await flash(
        request,
        error(partSummary.error, "Failed to load part summary")
      )
    );
  }

  return json(partSummary.data);
}

export default function PartsNewRoute() {
  return (
    <>
      <PartPreview />
      <Grid
        gridTemplateColumns={["1fr", "1fr", "2fr 8fr"]}
        gridColumnGap={8}
        w="full"
      >
        <PartSidebar />
        <Outlet />
      </Grid>
    </>
  );
}
