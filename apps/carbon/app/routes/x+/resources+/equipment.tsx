import { VStack } from "@chakra-ui/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import {
  EquipmentTypesTable,
  EquipmentTypesTableFilters,
  getEquipmentTypes,
} from "~/modules/resources";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";
import { getGenericQueryFilters } from "~/utils/query";
import { error } from "~/utils/result";

export const handle: Handle = {
  breadcrumb: "Equipment",
  to: path.to.equipment,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "resources",
    role: "employee",
  });

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const name = searchParams.get("name");
  const { limit, offset, sorts } = getGenericQueryFilters(searchParams);

  const equipmentTypes = await getEquipmentTypes(client, {
    name,
    limit,
    offset,
    sorts,
  });

  if (equipmentTypes.error) {
    redirect(
      path.to.resources,
      await flash(
        request,
        error(equipmentTypes.error, "Failed to fetch equipment types")
      )
    );
  }

  return json({
    count: equipmentTypes.count ?? 0,
    equipmentTypes: equipmentTypes.data ?? [],
  });
}

export default function UserAttributesRoute() {
  const { count, equipmentTypes } = useLoaderData<typeof loader>();

  return (
    <VStack w="full" h="full" spacing={0}>
      <EquipmentTypesTableFilters />
      <EquipmentTypesTable data={equipmentTypes} count={count} />
      <Outlet />
    </VStack>
  );
}
