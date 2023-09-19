import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Grid,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "@remix-run/react";
import { ValidatedForm } from "remix-validated-form";
import { Employee, Hidden, Input, Select, Submit } from "~/components/Form";
import { usePermissions, useRouteData } from "~/hooks";
import type {
  CustomerContact,
  CustomerLocation,
  CustomerStatus,
  CustomerType,
} from "~/modules/sales";
import { customerValidator } from "~/modules/sales";
import type { TypeOfValidator } from "~/types/validators";
import { CustomerContacts, CustomerLocations } from "./components";

type CustomerFormProps = {
  initialValues: TypeOfValidator<typeof customerValidator>;
  contacts?: CustomerContact[];
  locations?: CustomerLocation[];
};

const CustomerForm = ({
  initialValues,
  contacts,
  locations,
}: CustomerFormProps) => {
  const permissions = usePermissions();
  const navigate = useNavigate();
  const onClose = () => navigate("/x/sales/customers");

  const routeData = useRouteData<{
    customerTypes: CustomerType[];
    customerStatuses: CustomerStatus[];
  }>("/x/sales/customers");

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
    ? !permissions.can("update", "purchasing")
    : !permissions.can("create", "purchasing");

  return (
    <Drawer onClose={onClose} isOpen size="full">
      <ValidatedForm
        method="post"
        action={
          isEditing
            ? `/x/sales/customers/${initialValues.id}`
            : "/x/sales/customers/new"
        }
        validator={customerValidator}
        defaultValues={initialValues}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {isEditing ? initialValues.name : "New Customer"}
          </DrawerHeader>
          <DrawerBody>
            <Grid
              gridTemplateColumns={["1fr", "1fr", "5fr 2fr"]}
              gridColumnGap={8}
              w="full"
            >
              <Box w="full">
                <Hidden name="id" />
                <VStack spacing={4} w="full" alignItems="start">
                  <Grid
                    gridTemplateColumns={["1fr", "1fr", "1fr 1fr"]}
                    gridColumnGap={8}
                    gridRowGap={4}
                    w="full"
                  >
                    <Input name="name" label="Name" />
                    <Input name="taxId" label="Tax ID" />
                    <Select
                      name="customerTypeId"
                      label="Customer Type"
                      options={customerTypeOptions}
                      placeholder="Select Customer Type"
                    />
                    <Employee name="accountManagerId" label="Account Manager" />
                    <Select
                      name="customerStatusId"
                      label="Customer Status"
                      options={customerStatusOptions}
                      placeholder="Select Customer Status"
                    />
                  </Grid>
                </VStack>
              </Box>
              <VStack spacing={8} w="full" alignItems="start" py={[8, 8, 0]}>
                <CustomerLocations
                  locations={locations}
                  isEditing={isEditing}
                />
                <CustomerContacts
                  contacts={contacts}
                  locations={locations}
                  isEditing={isEditing}
                />
              </VStack>
            </Grid>
          </DrawerBody>
          <DrawerFooter>
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
          </DrawerFooter>
        </DrawerContent>
      </ValidatedForm>
    </Drawer>
  );
};

export default CustomerForm;
