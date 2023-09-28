import { Grid, VStack } from "@chakra-ui/react";
import { Outlet } from "@remix-run/react";
import { GroupedContentSidebar } from "~/components/Layout/Sidebar";
import { useInvoicingSidebar } from "~/modules/invoicing";

export default function InvoicingRoute() {
  const { groups } = useInvoicingSidebar();

  return (
    <Grid w="full" h="full" templateColumns="auto 1fr">
      <GroupedContentSidebar groups={groups} />
      <VStack w="full" h="full" spacing={0}>
        <Outlet />
      </VStack>
    </Grid>
  );
}
