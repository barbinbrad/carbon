import { Count, useColor } from "@carbon/react";
import { Button, Box, VStack } from "@chakra-ui/react";
import { Link, useMatches, useParams } from "@remix-run/react";
import { useRouteData } from "~/hooks";
import type {
  PurchaseOrder,
  PurchaseOrderAttachment,
} from "~/modules/purchasing";
import { usePurchaseOrderSidebar } from "./usePurchaseOrderSidebar";

const PurchaseOrderSidebar = () => {
  const { orderId } = useParams();
  const borderColor = useColor("gray.200");
  if (!orderId)
    throw new Error(
      "PurchaseOrderSidebar requires an orderId and could not find orderId in params"
    );

  const routeData = useRouteData<{
    purchaseOrder: PurchaseOrder;
    internalDocuments: PurchaseOrderAttachment[];
    externalDocuments: PurchaseOrderAttachment[];
  }>(`/x/purchase-order/${orderId}`);
  const links = usePurchaseOrderSidebar({
    lines: routeData?.purchaseOrder?.lineCount ?? 0,
    internalDocuments: routeData?.internalDocuments.length ?? 0,
    externalDocuments: routeData?.externalDocuments.length ?? 0,
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

export default PurchaseOrderSidebar;
