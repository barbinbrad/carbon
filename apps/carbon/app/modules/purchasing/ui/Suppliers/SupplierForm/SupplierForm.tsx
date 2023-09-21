import {
  Button,
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
import { useNavigate } from "@remix-run/react";
import { ValidatedForm } from "remix-validated-form";
import {
  Currency,
  Employee,
  Hidden,
  Input,
  Select,
  Submit,
} from "~/components/Form";
import { usePermissions, useRouteData } from "~/hooks";
import type { SupplierStatus, SupplierType } from "~/modules/purchasing";
import { supplierValidator } from "~/modules/purchasing";
import type { ListItem } from "~/types";
import type { TypeOfValidator } from "~/types/validators";

type SupplierFormProps = {
  initialValues: TypeOfValidator<typeof supplierValidator>;
};

const SupplierForm = ({ initialValues }: SupplierFormProps) => {
  const permissions = usePermissions();
  const navigate = useNavigate();
  const onClose = () => navigate("/x/purchasing/suppliers");

  const routeData = useRouteData<{
    supplierTypes: SupplierType[];
    supplierStatuses: SupplierStatus[];
    paymentTerms: ListItem[];
    shippingMethods: ListItem[];
    shippingTerms: ListItem[];
  }>("/x/supplier");

  const supplierTypeOptions =
    routeData?.supplierTypes?.map((type) => ({
      value: type.id,
      label: type.name,
    })) ?? [];

  const supplierStatusOptions =
    routeData?.supplierStatuses?.map((status) => ({
      value: status.id,
      label: status.name,
    })) ?? [];

  const paymentTermOptions =
    routeData?.paymentTerms?.map((term) => ({
      value: term.id,
      label: term.name,
    })) ?? [];

  const shippingMethodOptions =
    routeData?.shippingMethods?.map((method) => ({
      value: method.id,
      label: method.name,
    })) ?? [];

  const shippingTermOptions =
    routeData?.shippingTerms?.map((term) => ({
      value: term.id,
      label: term.name,
    })) ?? [];

  const isEditing = initialValues.id !== undefined;
  const isDisabled = isEditing
    ? !permissions.can("update", "purchasing")
    : !permissions.can("create", "purchasing");

  return (
    <ValidatedForm
      method="post"
      validator={supplierValidator}
      defaultValues={initialValues}
    >
      <Card w="full">
        <CardHeader>
          <Heading size="md">
            {isEditing ? "Supplier Basics" : "New Supplier"}
          </Heading>
          {!isEditing && (
            <Text color="gray.500">
              A supplier is a business or person who sells you parts or
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
              <Select
                name="supplierTypeId"
                label="Supplier Type"
                options={supplierTypeOptions}
                placeholder="Select Supplier Type"
              />
            </VStack>
            {isEditing && (
              <>
                <VStack alignItems="start" spacing={2} w="full">
                  <Employee name="accountManagerId" label="Account Manager" />
                  <Select
                    name="supplierStatusId"
                    label="Supplier Status"
                    options={supplierStatusOptions}
                    placeholder="Select Supplier Status"
                  />
                  <Currency
                    name="defaultCurrencyCode"
                    label="Currency"
                    placeholder="Default Currency"
                  />
                </VStack>
                <VStack alignItems="start" spacing={2} w="full">
                  <Select
                    name="defaultPaymentTermId"
                    label="Payment Term"
                    options={paymentTermOptions}
                    placeholder="Default Payment Term"
                  />
                  <Select
                    name="defaultShippingMethodId"
                    label="Shipping Method"
                    options={shippingMethodOptions}
                    placeholder="Default Shipping Method"
                  />
                  <Select
                    name="defaultShippingTermId"
                    label="Shipping Term"
                    options={shippingTermOptions}
                    placeholder="Default Shipping Term"
                  />
                </VStack>
              </>
            )}

            {/* <SupplierLocations
                  locations={locations}
                  isEditing={isEditing}
                />
                <SupplierContacts
                  contacts={contacts}
                  locations={locations}
                  isEditing={isEditing}
                /> */}
          </Grid>
        </CardBody>
        <CardFooter>
          <HStack spacing={2}>
            <Submit isDisabled={isDisabled}>Save</Submit>
            <Button
              size="md"
              colorScheme="gray"
              variant="solid"
              onClick={onClose}
            >
              Cancel
            </Button>
          </HStack>
        </CardFooter>
      </Card>
    </ValidatedForm>
  );
};

export default SupplierForm;
