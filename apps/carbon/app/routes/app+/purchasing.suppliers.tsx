import { VStack } from "@chakra-ui/react";
import type { LoaderArgs } from "@remix-run/node";
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
import { getGenericQueryFilters } from "~/utils/query";

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

  return json({ suppliers, supplierTypes, supplierStatuses });
}

export default function PurchasingSuppliersRoute() {
  const { suppliers, supplierTypes, supplierStatuses } =
    useLoaderData<typeof loader>();

  return (
    <VStack w="full" h="full" spacing={0}>
      <SuppliersTableFilters
        supplierTypes={supplierTypes.data ?? []}
        supplierStatuses={supplierStatuses.data ?? []}
      />
      <SuppliersTable
        data={suppliers.data ?? []}
        count={suppliers.count ?? 0}
      />
      <Outlet />
    </VStack>
  );
}
