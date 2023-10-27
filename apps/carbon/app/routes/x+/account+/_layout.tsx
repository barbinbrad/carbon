import { useColor } from "@carbon/react";
import { Grid, VStack } from "@chakra-ui/react";
import type { MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { ContentSidebar } from "~/components/Layout/Sidebar";
import { useAccountSidebar } from "~/modules/account";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";

export const meta: MetaFunction = () => {
  return [{ title: "Carbon | My Account" }];
};

export const handle: Handle = {
  breadcrumb: "Account",
  to: path.to.account,
  module: "account",
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
