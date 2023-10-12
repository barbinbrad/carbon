import { VStack } from "@chakra-ui/react";
import type { MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [{ title: "Carbon | Invoicing" }];
};

export default function PurchaseInvoiceRoute() {
  return (
    <VStack w="full" h="full" spacing={4} p={4}>
      <Outlet />
    </VStack>
  );
}
