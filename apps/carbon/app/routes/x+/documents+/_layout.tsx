import { Grid, VStack } from "@chakra-ui/react";
import type { V2_MetaFunction as MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { ContentSidebar } from "~/components/Layout/Sidebar";
import { useDocumentsSidebar } from "~/modules/documents";

export const meta: MetaFunction = () => {
  return [{ title: "Carbon | Documents" }];
};

export default function DocumentsRoute() {
  const { links } = useDocumentsSidebar();

  return (
    <Grid w="full" h="full" templateColumns="auto 1fr">
      <ContentSidebar links={links} />
      <VStack w="full" h="full">
        <Outlet />
      </VStack>
    </Grid>
  );
}
