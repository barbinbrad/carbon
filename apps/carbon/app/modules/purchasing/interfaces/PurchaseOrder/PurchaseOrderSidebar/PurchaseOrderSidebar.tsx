import { Button, Box, VStack } from "@chakra-ui/react";
import { Link, useMatches, useParams } from "@remix-run/react";
import { usePurchaseOrderSidebar } from "./usePurchaseOrderSidebar";

const PurchaseOrderSidebar = () => {
  const { orderId } = useParams();
  if (!orderId)
    throw new Error(
      "PurchaseOrderSidebar requires an orderId and could not find orderId in params"
    );

  const links = usePurchaseOrderSidebar();
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
                  border="none"
                  fontWeight={isActive ? "bold" : "normal"}
                  justifyContent="start"
                  size="md"
                  w="full"
                >
                  {route.name}
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
