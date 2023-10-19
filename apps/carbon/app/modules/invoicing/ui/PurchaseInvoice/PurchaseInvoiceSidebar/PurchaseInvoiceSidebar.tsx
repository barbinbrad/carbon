import { useColor } from "@carbon/react";
import { Box, Button, VStack } from "@chakra-ui/react";
import { Link, useMatches, useParams } from "@remix-run/react";
import { usePurchaseInvoiceSidebar } from "./usePurchaseInvoiceSidebar";

const PurchaseInvoiceSidebar = () => {
  const { invoiceId } = useParams();
  const borderColor = useColor("gray.200");
  if (!invoiceId)
    throw new Error(
      "PurchaseInvoiceSidebar requires an invoiceId and could not find invoiceId in params"
    );

  const links = usePurchaseInvoiceSidebar();
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
                  justifyContent="start"
                  size="md"
                  w="full"
                >
                  <span>{route.name}</span>
                </Button>
              );
            })}
          </VStack>
        </VStack>
      </Box>
    </VStack>
  );
};

export default PurchaseInvoiceSidebar;
