import { VStack } from "@chakra-ui/react";
import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import {
  SuppliersTable,
  SuppliersTableFilters,
} from "~/interfaces/Purchasing/Suppliers";
import { requirePermissions } from "~/services/auth";
import {
  getSuppliers,
  getSupplierStatuses,
  getSupplierTypes,
} from "~/services/purchasing";
import { flash } from "~/services/session";
import { getGenericQueryFilters } from "~/utils/query";
import { error } from "~/utils/result";

export async function loader({ request }: LoaderArgs) {
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

  const [suppliers, supplierTypes, supplierStatuses] = await Promise.all([
    getSuppliers(client, { name, type, status, limit, offset, sorts, filters }),
    getSupplierTypes(client),
    getSupplierStatuses(client),
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
