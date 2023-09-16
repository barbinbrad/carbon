import { useColor } from "@carbon/react";
import { Grid, VStack } from "@chakra-ui/react";
import type { V2_MetaFunction as MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { ContentSidebar } from "~/components/Layout/Sidebar";
import { useAccountSidebar } from "~/modules/account";

export const meta: MetaFunction = () => {
  return [{ title: "Carbon | My Account" }];
};

export default function AccountRoute() {
  const { links } = useAccountSidebar();

  return (
    <Grid w="full" h="full" templateColumns="auto 1fr">
      <ContentSidebar links={links} />
      <VStack w="full" h="full" spacing={0} p={8} bg={useColor("white")}>
        <Outlet />
      </VStack>
    </Grid>
  );
}
