import { VStack } from "@chakra-ui/react";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import {
  getPartCostingMethods,
  getPartGroupsList,
  getPartManufacturingPolicies,
  getPartReplenishmentSystems,
  getPartRorderdingPolicies,
  getPartTypes,
  getUnitOfMeasuresList,
} from "~/modules/parts";
import { getLocationsList } from "~/modules/resources";
import { requirePermissions } from "~/services/auth";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";

export const meta: MetaFunction = () => {
  return [{ title: "Carbon | Part" }];
};

export const handle: Handle = {
  breadcrumb: "Parts",
  to: path.to.parts,
  module: "parts",
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "parts",
  });

  const [partGroups, unitOfMeasures, locations] = await Promise.all([
    getPartGroupsList(client),
    getUnitOfMeasuresList(client),
    getLocationsList(client),
  ]);

  return {
    locations: locations?.data ?? [],
    partCostingMethods: getPartCostingMethods(),
    partGroups: partGroups?.data ?? [],
    partManufacturingPolicies: getPartManufacturingPolicies(),
    partReorderingPolicies: getPartRorderdingPolicies(),
    partReplenishmentSystems: getPartReplenishmentSystems(),
    partTypes: getPartTypes(),
    unitOfMeasures: unitOfMeasures?.data ?? [],
  };
}

export default function PartRoute() {
  return (
    <VStack w="full" h="full" spacing={4} p={4}>
      <Outlet />
    </VStack>
  );
}
