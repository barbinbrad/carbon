import { Menubar, MenubarItem } from "@carbon/react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  HStack,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { Form, useParams } from "@remix-run/react";
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
  const postingModal = useDisclosure();

  if (!invoiceId) throw new Error("invoiceId not found");

  const routeData = useRouteData<{ purchaseInvoice: PurchaseInvoice }>(
    path.to.purchaseInvoice(invoiceId)
  );

  if (!routeData?.purchaseInvoice) throw new Error("purchaseInvoice not found");
  const { purchaseInvoice } = routeData;

  const isPosted = purchaseInvoice.postingDate !== null;

  const [purchaseInvoiceTotals] = usePurchaseInvoiceTotals();

  // TODO: factor in default currency, po currency and exchange rate
  const formatter = useMemo(
    () =>
      new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }),
    []
  );

  return (
    <>
      <VStack w="full" alignItems="start" spacing={2}>
        {permissions.is("employee") && (
          <Menubar>
            <MenubarItem
              isDisabled={!permissions.can("update", "invoicing") || isPosted}
              onClick={postingModal.onOpen}
            >
              Post
            </MenubarItem>
          </Menubar>
        )}

        <Card w="full">
          <CardHeader>
            <HStack justifyContent="space-between" alignItems="start">
              <Stack direction="column" spacing={2}>
                <Heading size="md">{purchaseInvoice.invoiceId}</Heading>
                <Text color="gray.500" fontWeight="normal">
                  {purchaseInvoice.supplierName}
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
                <Text fontWeight="bold">{purchaseInvoice.dateIssued}</Text>
              </Stack>

              <Stack
                direction={["row", "row", "column"]}
                alignItems="start"
                justifyContent="space-between"
              >
                <Text color="gray.500">Status</Text>
                <PurchaseInvoicingStatus status={purchaseInvoice.status} />
              </Stack>
            </Stack>
          </CardBody>
        </Card>
      </VStack>
      <Modal isOpen={postingModal.isOpen} onClose={postingModal.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Post Invoice</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to post this invoice? This cannot be undone.
          </ModalBody>

          <ModalFooter>
            <HStack spacing={2}>
              <Button colorScheme="gray" onClick={postingModal.onClose}>
                Cancel
              </Button>
              <Form
                method="post"
                action={path.to.purchaseInvoicePost(invoiceId)}
              >
                <Button colorScheme="brand" type="submit">
                  Post Invoice
                </Button>
              </Form>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PurchaseInvoiceHeader;
