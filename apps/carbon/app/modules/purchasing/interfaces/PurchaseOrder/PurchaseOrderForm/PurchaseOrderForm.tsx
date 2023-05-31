import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Grid,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import { ValidatedForm } from "remix-validated-form";
import {
  Boolean,
  Currency,
  DatePicker,
  Input,
  Select,
  Submit,
  Supplier,
} from "~/components/Form";
import { usePermissions } from "~/hooks";
import type {
  PurchaseOrderApprovalStatus,
  PurchaseOrderType,
} from "~/modules/purchasing";
import { purchaseOrderValidator } from "~/modules/purchasing";

type PurchaseOrderFormValues = {
  id?: string;
  purchaseOrderId?: string;
  status: PurchaseOrderApprovalStatus;
  type: PurchaseOrderType;
  currencyCode: string;
};

type PurchaseOrderFormProps = {
  initialValues: PurchaseOrderFormValues;
  purchaseOrderApprovalStatuses: PurchaseOrderApprovalStatus[];
  purchaseOrderTypes: PurchaseOrderType[];
};

const PurchaseOrderForm = ({
  initialValues,
  purchaseOrderApprovalStatuses,
  purchaseOrderTypes,
}: PurchaseOrderFormProps) => {
  const permissions = usePermissions();
  const isEditing = initialValues.id !== undefined;

  const approvalOptions = purchaseOrderApprovalStatuses.map((approval) => ({
    label: approval,
    value: approval,
  }));

  const typeOptions = purchaseOrderTypes.map((type) => ({
    label: type,
    value: type,
  }));

  return (
    <ValidatedForm
      method="post"
      validator={purchaseOrderValidator}
      defaultValues={initialValues}
    >
      <Card w="full">
        <CardHeader>
          <Heading size="md">
            {isEditing ? "Purchase Order Basics" : "New Purchase Order"}
          </Heading>
          {!isEditing && (
            <Text color="gray.500">
              A purchase order contains information about the agreement between
              the company and a specific supplier for parts and services.
            </Text>
          )}
        </CardHeader>
        <CardBody>
          <Grid
            gridTemplateColumns={
              isEditing ? ["1fr", "1fr", "1fr 1fr 1fr"] : "1fr"
            }
            gridColumnGap={8}
            gridRowGap={2}
            w="full"
          >
            <VStack alignItems="start" spacing={2} w="full">
              {isEditing && (
                <Input
                  name="id"
                  label="Purchase Order ID"
                  isReadOnly={isEditing}
                />
              )}
              <Supplier name="supplierId" label="Supplier" />
              <DatePicker name="orderDate" label="Order Date" />
            </VStack>
            <VStack alignItems="start" spacing={2} w="full">
              <Select name="type" label="Type" options={typeOptions} />
              <Select
                name="status"
                label="Approval Status"
                options={approvalOptions}
              />
            </VStack>
            <VStack alignItems="start" spacing={2} w="full">
              <Currency name="currencyCode" label="Currency" />
              <Boolean name="blocked" label="Blocked" />
              {isEditing && <Boolean name="active" label="Active" />}
            </VStack>
          </Grid>
        </CardBody>
        <CardFooter>
          <Submit
            isDisabled={
              isEditing
                ? !permissions.can("update", "purchasing")
                : !permissions.can("create", "purchasing")
            }
          >
            Save
          </Submit>
        </CardFooter>
      </Card>
    </ValidatedForm>
  );
};

export default PurchaseOrderForm;
