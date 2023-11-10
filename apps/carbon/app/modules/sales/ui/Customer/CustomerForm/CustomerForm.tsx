import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Grid,
  Heading,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { ValidatedForm } from "remix-validated-form";
import { Employee, Hidden, Input, Select, Submit } from "~/components/Form";
import { usePermissions, useRouteData } from "~/hooks";
import type { CustomerStatus, CustomerType } from "~/modules/sales";
import { customerValidator } from "~/modules/sales";
import type { TypeOfValidator } from "~/types/validators";
import { path } from "~/utils/path";

type CustomerFormProps = {
  initialValues: TypeOfValidator<typeof customerValidator>;
};

const CustomerForm = ({ initialValues }: CustomerFormProps) => {
  const permissions = usePermissions();

  const routeData = useRouteData<{
    customerTypes: CustomerType[];
    customerStatuses: CustomerStatus[];
  }>(path.to.customerRoot);

  const customerTypeOptions =
    routeData?.customerTypes?.map((type) => ({
      value: type.id,
      label: type.name,
    })) ?? [];

  const customerStatusOptions =
    routeData?.customerStatuses?.map((status) => ({
      value: status.id,
      label: status.name,
    })) ?? [];

  const isEditing = initialValues.id !== undefined;
  const isDisabled = isEditing
    ? !permissions.can("update", "sales")
    : !permissions.can("create", "sales");

  return (
    <ValidatedForm
      method="post"
      validator={customerValidator}
      defaultValues={initialValues}
    >
      <Card w="full">
        <CardHeader>
          <Heading size="md">
            {isEditing ? "Customer Overview" : "New Customer"}
          </Heading>
          {!isEditing && (
            <Text color="gray.500">
              A customer is a business or person who buys your parts or
              services.
            </Text>
          )}
        </CardHeader>
        <CardBody>
          <Hidden name="id" />
          <Grid
            gridTemplateColumns={
              isEditing ? ["1fr", "1fr", "1fr 1fr 1fr"] : "1fr"
            }
            gridColumnGap={8}
            gridRowGap={2}
            w="full"
          >
            <VStack alignItems="start" spacing={2} w="full">
              <Input name="name" label="Name" />
              <Input name="taxId" label="Tax ID" />
            </VStack>
            <VStack alignItems="start" spacing={2} w="full">
              <Select
                name="customerTypeId"
                label="Customer Type"
                options={customerTypeOptions}
                placeholder="Select Customer Type"
              />
              <Select
                name="customerStatusId"
                label="Customer Status"
                options={customerStatusOptions}
                placeholder="Select Customer Status"
              />
            </VStack>
            {isEditing && (
              <>
                <VStack alignItems="start" spacing={2} w="full">
                  <Employee name="accountManagerId" label="Account Manager" />
                </VStack>
              </>
            )}
          </Grid>
        </CardBody>
        <CardFooter>
          <HStack spacing={2}>
            <Submit isDisabled={isDisabled}>Save</Submit>
          </HStack>
        </CardFooter>
      </Card>
    </ValidatedForm>
  );
};

export default CustomerForm;
