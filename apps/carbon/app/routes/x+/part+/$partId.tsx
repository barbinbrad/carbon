import { Grid } from "@chakra-ui/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { getPartSummary, PartPreview, PartSidebar } from "~/modules/parts";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { error } from "~/utils/result";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "parts",
  });

  const { partId } = params;
  if (!partId) throw new Error("Could not find partId");

  const [partSummary] = await Promise.all([getPartSummary(client, partId)]);

  if (partSummary.error) {
    return redirect(
      "/x/parts",
      await flash(
        request,
        error(partSummary.error, "Failed to load part summary")
      )
    );
  }

  return json({
    partSummary: partSummary.data,
  });
}

export default function PartRoute() {
  return (
    <>
      <PartPreview />
      <Grid
        gridTemplateColumns={["1fr", "1fr", "1fr 4fr"]}
        gridColumnGap={4}
        w="full"
      >
        <PartSidebar />
        <Outlet />
      </Grid>
    </>
  );
}
