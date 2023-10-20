import { VStack } from "@chakra-ui/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import {
  getPurchaseInvoices,
  PurchaseInvoicesTable,
  PurchaseInvoicesTableFilters,
} from "~/modules/invoicing";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { path } from "~/utils/path";
import { getGenericQueryFilters } from "~/utils/query";
import { error } from "~/utils/result";

export async function loader({ request }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "invoicing",
  });

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const search = searchParams.get("search");
  const status = searchParams.get("status");
  const supplierId = searchParams.get("supplierId");

  const { limit, offset, sorts, filters } =
    getGenericQueryFilters(searchParams);

  const [purchaseInvoices] = await Promise.all([
    getPurchaseInvoices(client, {
      search,
      status,
      supplierId,
      limit,
      offset,
      sorts,
      filters,
    }),
  ]);

  if (purchaseInvoices.error) {
    redirect(
      path.to.invoicing,
      await flash(
        request,
        error(purchaseInvoices.error, "Failed to fetch purchas orders")
      )
    );
  }

  return json({
    count: purchaseInvoices.count ?? 0,
    purchaseInvoices: purchaseInvoices.data ?? [],
  });
}

export default function PurchaseInvoicesSearchRoute() {
  const { count, purchaseInvoices } = useLoaderData<typeof loader>();

  return (
    <VStack w="full" h="full" spacing={0}>
      <PurchaseInvoicesTableFilters />
      <PurchaseInvoicesTable data={purchaseInvoices} count={count} />
      <Outlet />
    </VStack>
  );
}
