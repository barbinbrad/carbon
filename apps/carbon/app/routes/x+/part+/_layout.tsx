import { VStack } from "@chakra-ui/react";
import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import {
  getPartCostingMethods,
  getPartGroupsList,
  getPartManufacturingPolicies,
  getPartRorderdingPolicies,
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
