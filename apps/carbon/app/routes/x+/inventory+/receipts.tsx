import { VStack } from "@chakra-ui/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import {
  ReceiptsTable,
  ReceiptsTableFilters,
  getReceipts,
} from "~/modules/inventory";
import { getLocationsList } from "~/modules/resources";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";
import { getGenericQueryFilters } from "~/utils/query";
import { error } from "~/utils/result";

export const handle: Handle = {
  breadcrumb: "Receipts",
  to: path.to.receipts,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "inventory",
    role: "employee",
  });

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const search = searchParams.get("search");
  const document = searchParams.get("document");
  const location = searchParams.get("location");
  const { limit, offset, sorts } = getGenericQueryFilters(searchParams);

  const [receipts, locations] = await Promise.all([
    getReceipts(client, {
      search,
      document,
      location,
      limit,
      offset,
      sorts,
    }),
    getLocationsList(client),
  ]);

  if (receipts.error) {
    return redirect(
      path.to.inventory,
      await flash(request, error(null, "Error loading receipts"))
    );
  }

  return json({
    receipts: receipts.data ?? [],
    count: receipts.count ?? 0,
    locations: locations.data ?? [],
  });
}

export default function ReceiptsRoute() {
  const { receipts, count, locations } = useLoaderData<typeof loader>();

  return (
    <VStack w="full" h="full" spacing={0}>
      <ReceiptsTableFilters locations={locations ?? []} />
      <ReceiptsTable data={receipts} count={count ?? 0} />
      <Outlet />
    </VStack>
  );
}
