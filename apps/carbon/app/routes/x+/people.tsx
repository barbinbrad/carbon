import { Grid, VStack } from "@chakra-ui/react";
import type { MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { GroupedContentSidebar } from "~/components/Layout/Sidebar";
import { usePeopleSidebar } from "~/interfaces/People";

export const meta: MetaFunction = () => ({
  title: "Carbon | People",
});

export default function PeopleRoute() {
  const { groups } = usePeopleSidebar();

  return (
    <Grid w="full" h="full" templateColumns="auto 1fr" overflow="auto">
      <GroupedContentSidebar groups={groups} />
      <VStack w="full" h="full" spacing={0}>
        <Outlet />
      </VStack>
    </Grid>
  );
}
