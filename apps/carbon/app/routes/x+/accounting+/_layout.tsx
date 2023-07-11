import { Grid, VStack } from "@chakra-ui/react";
import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { GroupedContentSidebar } from "~/components/Layout/Sidebar";
import { getBaseCurrency, useAccountingSidebar } from "~/modules/accounting";
import { requirePermissions } from "~/services/auth";

export const meta: MetaFunction = () => ({
  title: "Carbon | Accounting",
});

export async function loader({ request }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    view: "accounting",
  });

  const [baseCurrency] = await Promise.all([getBaseCurrency(client)]);

  return json({
    baseCurrency: baseCurrency.data,
  });
}

export default function UsersRoute() {
  const { groups } = useAccountingSidebar();

  return (
    <Grid w="full" h="full" templateColumns="auto 1fr" overflow="auto">
      <GroupedContentSidebar groups={groups} />
      <VStack w="full" h="full" spacing={0}>
        <Outlet />
      </VStack>
    </Grid>
  );
}
