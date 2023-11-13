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
import { useMemo } from "react";
import { FaHistory } from "react-icons/fa";
import { usePermissions, useRouteData } from "~/hooks";
import type { PurchaseInvoice } from "~/modules/invoicing";
import {
  PurchaseInvoicingStatus,
  usePurchaseInvoiceTotals,
} from "~/modules/invoicing";
import { path } from "~/utils/path";

const PurchaseInvoiceHeader = () => {
  const permissions = usePermissions();
  const { invoiceId } = useParams();

  if (!invoiceId) throw new Error("Could not find invoiceId");

  const routeData = useRouteData<{ purchaseInvoice: PurchaseInvoice }>(
    path.to.purchaseInvoice(invoiceId)
  );

  const [purchaseInvoiceTotals] = usePurchaseInvoiceTotals();

  // TODO: factor in default currency, po currency and exchange rate
  const formatter = useMemo(
    () =>
      new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }),
    []
  );

  return (
    <VStack w="full" alignItems="start" spacing={2}>
      {permissions.is("employee") && (
        <Menubar>
          <MenubarItem
          // onClick={() => {
          //   if (routeData?.purchaseInvoice) release(routeData.purchaseInvoice);
          // }}
          // isDisabled={
          //   !["Draft", "Approved"].includes(
          //     routeData?.purchaseInvoice?.status ?? ""
          //   )
          // }
          >
            Action 1
          </MenubarItem>
        </Menubar>
      )}

      <Card w="full">
        <CardHeader>
          <HStack justifyContent="space-between" alignItems="start">
            <Stack direction="column" spacing={2}>
              <Heading size="md">
                {routeData?.purchaseInvoice?.invoiceId}
              </Heading>
              <Text color="gray.500">
                {routeData?.purchaseInvoice?.supplierName}
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
              <Text color="gray.500">Total</Text>
              <Text fontWeight="bold">
                {formatter.format(purchaseInvoiceTotals?.total ?? 0)}
              </Text>
            </Stack>
            <Stack
              direction={["row", "row", "column"]}
              alignItems="start"
              justifyContent="space-between"
            >
              <Text color="gray.500">Date Issued</Text>
              <Text fontWeight="bold">
                {routeData?.purchaseInvoice?.dateIssued}
              </Text>
            </Stack>

            <Stack
              direction={["row", "row", "column"]}
              alignItems="start"
              justifyContent="space-between"
            >
              <Text color="gray.500">Status</Text>
              <PurchaseInvoicingStatus
                status={routeData?.purchaseInvoice?.status}
              />
            </Stack>
          </Stack>
        </CardBody>
      </Card>
    </VStack>
  );
};

export default PurchaseInvoiceHeader;
