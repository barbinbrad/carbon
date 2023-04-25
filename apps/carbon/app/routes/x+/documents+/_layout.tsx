import { Grid, VStack } from "@chakra-ui/react";
import type { MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { ContentSidebar } from "~/components/Layout/Sidebar";
import { useDocumentsSidebar } from "~/modules/documents";

export const meta: MetaFunction = () => ({
  title: "Carbon | Documents",
});

export default function DocumentsRoute() {
  const { links } = useDocumentsSidebar();

  return (
    <Grid w="full" h="full" templateColumns="auto 1fr" overflow="auto">
      <ContentSidebar links={links} />
      <VStack w="full" h="full">
        <Outlet />
      </VStack>
    </Grid>
  );
}
