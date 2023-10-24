import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  HStack,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useParams } from "@remix-run/react";
import { FaHistory } from "react-icons/fa";
import { useRouteData } from "~/hooks";
import type {
  SupplierDetail,
  SupplierStatus,
  SupplierType,
} from "~/modules/purchasing";
import type { ListItem } from "~/types";
import { path } from "~/utils/path";

const SupplierHeader = () => {
  const { supplierId } = useParams();
  if (!supplierId) throw new Error("Could not find supplierId");
  const routeData = useRouteData<{ supplier: SupplierDetail }>(
    path.to.supplier(supplierId)
  );

  const sharedSupplierData = useRouteData<{
    supplierTypes: SupplierType[];
    supplierStatuses: SupplierStatus[];
    paymentTerms: ListItem[];
  }>(path.to.supplierRoot);

  return (
    <VStack w="full" alignItems="start" spacing={2}>
      <Card w="full">
        <CardHeader>
          <HStack justifyContent="space-between" alignItems="start">
            <Stack direction="column" spacing={2}>
              <Heading size="md">{routeData?.supplier?.name}</Heading>
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
              <Text color="gray.500">Type</Text>
              <Text fontWeight="bold">
                {sharedSupplierData?.supplierTypes?.find(
                  (type) => type.id === routeData?.supplier?.supplierTypeId
                )?.name ?? "--"}
              </Text>
            </Stack>
            <Stack
              direction={["row", "row", "column"]}
              alignItems="start"
              justifyContent="space-between"
            >
              <Text color="gray.500">Status</Text>
              <Text fontWeight="bold">
                {sharedSupplierData?.supplierStatuses?.find(
                  (status) =>
                    status.id === routeData?.supplier?.supplierStatusId
                )?.name ?? "--"}
              </Text>
            </Stack>
            <Stack
              direction={["row", "row", "column"]}
              alignItems="start"
              justifyContent="space-between"
            >
              <Text color="gray.500">Payment Terms</Text>
              <Text fontWeight="bold">
                {sharedSupplierData?.paymentTerms?.find(
                  (term) =>
                    term.id === routeData?.supplier?.defaultPaymentTermId
                )?.name ?? "--"}
              </Text>
            </Stack>
          </Stack>
        </CardBody>
      </Card>
    </VStack>
  );
};

export default SupplierHeader;
