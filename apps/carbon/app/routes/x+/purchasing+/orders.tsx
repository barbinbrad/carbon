import { VStack } from "@chakra-ui/react";
import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import {
  PurchaseOrdersTable,
  PurchaseOrdersTableFilters,
  getPurchaseOrders,
  getPurchaseOrderSuppliers,
} from "~/modules/purchasing";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { getGenericQueryFilters } from "~/utils/query";
import { error } from "~/utils/result";

export async function loader({ request }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    view: "purchasing",
  });

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const search = searchParams.get("search");
  const status = searchParams.get("status");
  const supplierId = searchParams.get("supplierId");

  const { limit, offset, sorts, filters } =
    getGenericQueryFilters(searchParams);

  const [purchasOrders, suppliers] = await Promise.all([
    getPurchaseOrders(client, {
      search,
      status,
      supplierId,
      limit,
      offset,
      sorts,
      filters,
    }),
    getPurchaseOrderSuppliers(client),
  ]);

  if (purchasOrders.error) {
    redirect(
      "/x",
      await flash(
        request,
        error(purchasOrders.error, "Failed to fetch purchas orders")
      )
    );
  }

  return json({
    count: purchasOrders.count ?? 0,
    purchasOrders: purchasOrders.data ?? [],
    suppliers: suppliers.data ?? [],
  });
}

export default function PurchaseOrdersSearchRoute() {
  const { count, purchasOrders, suppliers } = useLoaderData<typeof loader>();

  return (
    <VStack w="full" h="full" spacing={0}>
      <PurchaseOrdersTableFilters suppliers={suppliers} />
      <PurchaseOrdersTable data={purchasOrders} count={count} />
      <Outlet />
    </VStack>
  );
}
