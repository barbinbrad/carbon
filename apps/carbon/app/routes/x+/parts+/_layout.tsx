import { Grid, VStack } from "@chakra-ui/react";
import type { MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { GroupedContentSidebar } from "~/components/Layout/Sidebar";
import { usePartsSidebar } from "~/modules/parts";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";

export const meta: MetaFunction = () => {
  return [{ title: "Carbon | Parts" }];
};

export const handle: Handle = {
  breadcrumb: "Parts",
  to: path.to.parts,
  module: "parts",
};

export default function PartsRoute() {
  const { groups } = usePartsSidebar();

  return (
    <Grid w="full" h="full" templateColumns="auto 1fr">
      <GroupedContentSidebar groups={groups} />
      <VStack w="full" h="full" spacing={0}>
        <Outlet />
      </VStack>
    </Grid>
  );
}
