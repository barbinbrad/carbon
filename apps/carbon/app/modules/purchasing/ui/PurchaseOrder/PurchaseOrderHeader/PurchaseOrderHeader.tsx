import { Menubar, MenubarItem } from "@carbon/react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  HStack,
  Heading,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useParams } from "@remix-run/react";
import { FaHistory } from "react-icons/fa";
import { usePermissions, useRouteData } from "~/hooks";
import type { PurchaseOrder } from "~/modules/purchasing";
import { PurchasingStatus } from "~/modules/purchasing";
import { path } from "~/utils/path";
import { usePurchaseOrder } from "../../PurchaseOrders/usePurchaseOrder";

const PurchaseOrderHeader = () => {
  const permissions = usePermissions();
  const { orderId } = useParams();
  if (!orderId) throw new Error("Could not find orderId");

  const routeData = useRouteData<{ purchaseOrder: PurchaseOrder }>(
    path.to.purchaseOrder(orderId)
  );

  // TODO: factor in default currency, po currency and exchange rate

  const { receive, release, invoice } = usePurchaseOrder();

  return (
    <VStack w="full" alignItems="start" spacing={2}>
      {permissions.is("employee") && (
        <Menubar>
          <MenubarItem
            onClick={() => {
              if (!routeData?.purchaseOrder)
                throw new Error("purchaseOrder not found");
              release(routeData.purchaseOrder);
            }}
            isDisabled={
              !["Draft", "Approved"].includes(
                routeData?.purchaseOrder?.status ?? ""
              )
            }
          >
            Release
          </MenubarItem>
          <MenubarItem
            onClick={() => {
              if (!routeData?.purchaseOrder)
                throw new Error("purchaseOrder not found");
              receive(routeData.purchaseOrder);
            }}
            isDisabled={
              routeData?.purchaseOrder?.status !== "To Receive" &&
              routeData?.purchaseOrder?.status !== "To Receive and Invoice"
            }
          >
            Receive
          </MenubarItem>
          <MenubarItem
            onClick={() => {
              if (!routeData?.purchaseOrder)
                throw new Error("purchaseOrder not found");
              invoice(routeData.purchaseOrder);
            }}
            isDisabled={
              routeData?.purchaseOrder?.status !== "To Invoice" &&
              routeData?.purchaseOrder?.status !== "To Receive and Invoice"
            }
          >
            Invoice
          </MenubarItem>
        </Menubar>
      )}

      <Card w="full">
        <CardHeader>
          <HStack justifyContent="space-between" alignItems="start">
            <Stack direction="column" spacing={2}>
              <Heading size="md">
                {routeData?.purchaseOrder?.purchaseOrderId}
              </Heading>
              <Text color="gray.500">
                {routeData?.purchaseOrder?.supplierName}
              </Text>
            </Stack>
            <Button onClick={() => alert("TODO")} leftIcon={<FaHistory />}>
              Supplier Details
            </Button>
          </HStack>
        </CardHeader>
        <CardBody>
          <Stack direction={["column", "column", "row"]} spacing={8}>
            <Stack
              direction={["row", "row", "column"]}
              alignItems="start"
              justifyContent="space-between"
            >
              <Text color="gray.500">Order Date</Text>
              <Text fontWeight="bold">
                {routeData?.purchaseOrder?.orderDate}
              </Text>
            </Stack>

            <Stack
              direction={["row", "row", "column"]}
              alignItems="start"
              justifyContent="space-between"
            >
              <Text color="gray.500">Promised Date</Text>
              <Text fontWeight="bold">
                {routeData?.purchaseOrder?.receiptPromisedDate}
              </Text>
            </Stack>
            <Stack
              direction={["row", "row", "column"]}
              alignItems="start"
              justifyContent="space-between"
            >
              <Text color="gray.500">Type</Text>
              <Text fontWeight="bold">{routeData?.purchaseOrder?.type}</Text>
            </Stack>
            {/* 
            <Stack
              direction={["row", "row", "column"]}
              alignItems="start"
              justifyContent="space-between"
            >
              <Text color="gray.500">Subtotal</Text>
              <Text fontWeight="bold">
                // TODO: this doesn't update when client-side lines are updated
                {currencyFormatter.format(
                  routeData?.purchaseOrder?.subtotal ?? 0
                )}
              </Text>
            </Stack> 
            */}
            <Stack
              direction={["row", "row", "column"]}
              alignItems="start"
              justifyContent="space-between"
            >
              <Text color="gray.500">Status</Text>
              <PurchasingStatus status={routeData?.purchaseOrder?.status} />
            </Stack>
          </Stack>
        </CardBody>
      </Card>
    </VStack>
  );
};

export default PurchaseOrderHeader;
