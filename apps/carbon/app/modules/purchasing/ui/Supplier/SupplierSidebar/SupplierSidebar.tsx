import { Count, useColor } from "@carbon/react";
import { Box, Button, VStack } from "@chakra-ui/react";
import { Link, useMatches, useParams } from "@remix-run/react";
import { useRouteData } from "~/hooks";
import type {
  SupplierContact,
  SupplierDetail,
  SupplierLocation,
} from "~/modules/purchasing";
import { useSupplierSidebar } from "./useSupplierSidebar";

const SupplierSidebar = () => {
  const { supplierId } = useParams();
  const borderColor = useColor("gray.200");
  if (!supplierId)
    throw new Error(
      "SupplierSidebar requires an supplierId and could not find supplierId in params"
    );

  const routeData = useRouteData<{
    purchaseOrder: SupplierDetail;
    contacts: SupplierContact[];
    locations: SupplierLocation[];
  }>(`/x/supplier/${supplierId}`);
  const links = useSupplierSidebar({
    contacts: routeData?.contacts.length ?? 0,
    locations: routeData?.locations.length ?? 0,
  });
  const matches = useMatches();

  return (
    <VStack h="full" alignItems="start">
      <Box overflowY="auto" w="full" h="full">
        <VStack spacing={2}>
          <VStack spacing={1} alignItems="start" w="full">
            {links.map((route) => {
              const isActive = matches.some(
                (match) =>
                  (match.pathname.includes(route.to) && route.to !== "") ||
                  (match.id.includes(".index") && route.to === "")
              );

              return (
                <Button
                  key={route.name}
                  as={Link}
                  to={route.to}
                  variant={isActive ? "solid" : "ghost"}
                  border={isActive ? "1px solid" : "none"}
                  borderColor={borderColor}
                  fontWeight={isActive ? "bold" : "normal"}
                  justifyContent={
                    route.count === undefined ? "start" : "space-between"
                  }
                  size="md"
                  w="full"
                >
                  <span>{route.name}</span>
                  {route.count !== undefined && <Count count={route.count} />}
                </Button>
              );
            })}
          </VStack>
        </VStack>
      </Box>
    </VStack>
  );
};

export default SupplierSidebar;
