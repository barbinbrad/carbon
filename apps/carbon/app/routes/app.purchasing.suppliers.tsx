import { VStack } from "@chakra-ui/react";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import {
  SuppliersTable,
  SuppliersTableFilters,
} from "~/interfaces/Purchasing/Suppliers";
import { requirePermissions } from "~/services/auth";
import { getSuppliers, getSupplierTypes } from "~/services/purchasing";
import { getGenericQueryFilters } from "~/utils/query";

export async function loader({ request }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    view: "purchasing",
  });

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const name = searchParams.get("name");
  const type = searchParams.get("type");
  const active = searchParams.get("active") !== "false";

  const { limit, offset, sorts, filters } =
    getGenericQueryFilters(searchParams);

  const [suppliers, supplierTypes] = await Promise.all([
    getSuppliers(client, { name, type, active, limit, offset, sorts, filters }),
    getSupplierTypes(client),
  ]);

  return json({ suppliers, supplierTypes });
}

export default function PurchasingSuppliersRoute() {
  const { suppliers, supplierTypes } = useLoaderData<typeof loader>();

  return (
    <VStack w="full" h="full" spacing={0}>
      <SuppliersTableFilters supplierTypes={supplierTypes.data ?? []} />
      <SuppliersTable
        data={suppliers.data ?? []}
        count={suppliers.count ?? 0}
      />
      <Outlet />
    </VStack>
  );
}
