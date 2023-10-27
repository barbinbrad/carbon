import { Grid, VStack } from "@chakra-ui/react";
import type { MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { ContentSidebar } from "~/components/Layout/Sidebar";
import { useDocumentsSidebar } from "~/modules/documents";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";

export const meta: MetaFunction = () => {
  return [{ title: "Carbon | Documents" }];
};

export const handle: Handle = {
  breadcrumb: "Documents",
  to: path.to.documents,
  module: "documents",
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
