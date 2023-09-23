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
  CustomerDetail,
  CustomerStatus,
  CustomerType,
} from "~/modules/sales";
import type { ListItem } from "~/types";

const CustomerHeader = () => {
  const { customerId } = useParams();
  if (!customerId) throw new Error("Could not find customerId");
  const routeData = useRouteData<{ customer: CustomerDetail }>(
    `/x/customer/${customerId}`
  );
  const sharedCustomerData = useRouteData<{
    customerTypes: CustomerType[];
    customerStatuses: CustomerStatus[];
    paymentTerms: ListItem[];
  }>("/x/customer");

  return (
    <VStack w="full" alignItems="start" spacing={2}>
      <Card w="full">
        <CardHeader>
          <HStack justifyContent="space-between" alignItems="start">
            <Stack direction="column" spacing={2}>
              <Heading size="md">{routeData?.customer?.name}</Heading>
            </Stack>
            <Button onClick={() => alert("TODO")} leftIcon={<FaHistory />}>
              Customer Details
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
                {sharedCustomerData?.customerTypes?.find(
                  (type) => type.id === routeData?.customer?.customerTypeId
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
                {sharedCustomerData?.customerStatuses?.find(
                  (status) =>
                    status.id === routeData?.customer?.customerStatusId
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
                {sharedCustomerData?.paymentTerms?.find(
                  (term) =>
                    term.id === routeData?.customer?.defaultPaymentTermId
                )?.name ?? "--"}
              </Text>
            </Stack>
          </Stack>
        </CardBody>
      </Card>
    </VStack>
  );
};

export default CustomerHeader;
