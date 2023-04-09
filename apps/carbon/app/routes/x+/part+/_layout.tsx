import { VStack } from "@chakra-ui/react";
import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import {
  getPartCostingMethods,
  getPartGroupsList,
  getPartManufacturingPolicies,
  getPartReplenishmentSystems,
  getPartTypes,
  getUnitOfMeasuresList,
} from "~/modules/parts";
import { requirePermissions } from "~/services/auth";

export const meta: MetaFunction = () => ({
  title: "Carbon | Parts",
});

export async function loader({ request }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    view: "parts",
  });

  const [partGroups, unitOfMeasures] = await Promise.all([
    getPartGroupsList(client),
    getUnitOfMeasuresList(client),
  ]);

  return {
    partGroups: partGroups?.data ?? [],
    partTypes: getPartTypes(),
    partReplenishmentSystems: getPartReplenishmentSystems(),
    partManufacturingPolicies: getPartManufacturingPolicies(),
    partCostingMethods: getPartCostingMethods(),
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
