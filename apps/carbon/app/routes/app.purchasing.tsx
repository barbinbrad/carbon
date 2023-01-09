import { Grid, VStack } from "@chakra-ui/react";
import type { MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { GroupedContentSidebar } from "~/components/Layout/Sidebar";
import { usePurchasingSidebar } from "~/interfaces/Purchasing";

export const meta: MetaFunction = () => ({
  title: "Carbon | Purchasing",
});

export default function UsersRoute() {
  const { links } = usePurchasingSidebar();

  return (
    <Grid w="full" h="full" templateColumns="auto 1fr" overflow="auto">
      <GroupedContentSidebar links={links} />
      <VStack w="full" h="full" spacing={0}>
        <Outlet />
      </VStack>
    </Grid>
  );
}
