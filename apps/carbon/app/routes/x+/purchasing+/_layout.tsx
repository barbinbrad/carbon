import { Grid, VStack } from "@chakra-ui/react";
import type { V2_MetaFunction as MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { GroupedContentSidebar } from "~/components/Layout/Sidebar";
import { usePurchasingSidebar } from "~/modules/purchasing";

export const meta: MetaFunction = () => {
  return [{ title: "Carbon | Purchasing" }];
};

export default function UsersRoute() {
  const { groups } = usePurchasingSidebar();

  return (
    <Grid w="full" h="full" templateColumns="auto 1fr">
      <GroupedContentSidebar groups={groups} />
      <VStack w="full" h="full" spacing={0}>
        <Outlet />
      </VStack>
    </Grid>
  );
}
