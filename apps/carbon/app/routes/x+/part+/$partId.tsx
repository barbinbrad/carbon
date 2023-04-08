import { Grid } from "@chakra-ui/react";
import { Outlet } from "@remix-run/react";
import { PartPreview, PartSidebar } from "~/modules/parts";

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
