import { VStack } from "@chakra-ui/react";
import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { usePermissions } from "~/hooks";
import {
  SupplierAccountsTable,
  SupplierAccountsTableFilters,
} from "~/interfaces/Users/Suppliers";
import { getSupplierTypes } from "~/modules/purchasing";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { getSuppliers } from "~/services/users";
import { getGenericQueryFilters } from "~/utils/query";
import { error } from "~/utils/result";

export async function loader({ request }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    view: "users",
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
  if (suppliers.error) {
    return redirect(
      "/x",
      await flash(request, error(suppliers.error, "Error loading suppliers"))
    );
  }
  if (supplierTypes.error) {
    return redirect(
      "/x",
      await flash(
        request,
        error(supplierTypes.error, "Error loading supplier types")
      )
    );
  }

  return json({
    count: suppliers.count ?? 0,
    suppliers: suppliers.data,
    supplierTypes: supplierTypes.data,
  });
}

export default function UsersSuppliersRoute() {
  const { count, suppliers, supplierTypes } = useLoaderData<typeof loader>();
  const permissions = usePermissions();

  return (
    <VStack w="full" h="full" spacing={0}>
      <SupplierAccountsTableFilters supplierTypes={supplierTypes} />
      <SupplierAccountsTable
        data={suppliers}
        count={count}
        isEditable={permissions.can("update", "users")}
      />
      <Outlet />
    </VStack>
  );
}
