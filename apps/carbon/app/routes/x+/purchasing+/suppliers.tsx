import { VStack } from "@chakra-ui/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { getPaymentTermsList } from "~/modules/accounting";
import {
  getShippingMethodsList,
  getShippingTermsList,
} from "~/modules/inventory";
import {
  getSuppliers,
  getSupplierStatuses,
  getSupplierTypes,
  SuppliersTable,
  SuppliersTableFilters,
} from "~/modules/purchasing";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { getGenericQueryFilters } from "~/utils/query";
import { error } from "~/utils/result";

export async function loader({ request }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "purchasing",
  });

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const name = searchParams.get("name");
  const type = searchParams.get("type");
  const status = searchParams.get("status");

  const { limit, offset, sorts, filters } =
    getGenericQueryFilters(searchParams);

  const [
    suppliers,
    supplierTypes,
    supplierStatuses,
    paymentTerms,
    shippingMethods,
    shippingTerms,
  ] = await Promise.all([
    getSuppliers(client, { name, type, status, limit, offset, sorts, filters }),
    getSupplierTypes(client),
    getSupplierStatuses(client),
    getPaymentTermsList(client),
    getShippingMethodsList(client),
    getShippingTermsList(client),
  ]);

  if (suppliers.error) {
    redirect(
      "/x",
      await flash(request, error(suppliers.error, "Failed to fetch suppliers"))
    );
  }

  return json({
    count: suppliers.count ?? 0,
    suppliers: suppliers.data ?? [],
    supplierStatuses: supplierStatuses.data ?? [],
    supplierTypes: supplierTypes.data ?? [],
    paymentTerms: paymentTerms.data ?? [],
    shippingMethods: shippingMethods.data ?? [],
    shippingTerms: shippingTerms.data ?? [],
  });
}

export default function PurchasingSuppliersRoute() {
  const { count, suppliers, supplierTypes, supplierStatuses } =
    useLoaderData<typeof loader>();

  return (
    <VStack w="full" h="full" spacing={0}>
      <SuppliersTableFilters
        supplierTypes={supplierTypes}
        supplierStatuses={supplierStatuses}
      />
      <SuppliersTable data={suppliers} count={count} />
      <Outlet />
    </VStack>
  );
}
