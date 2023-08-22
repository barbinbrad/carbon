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
import {
  Employee,
  Input,
  Select,
  Submit,
  Hidden,
  Currency,
} from "~/components/Form";
import { usePermissions, useRouteData } from "~/hooks";
import { supplierValidator } from "~/modules/purchasing";
import type {
  SupplierContact,
  SupplierLocation,
  SupplierStatus,
  SupplierType,
} from "~/modules/purchasing";
import { mapRowsToOptions } from "~/utils/form";
import type { TypeOfValidator } from "~/types/validators";
import { SupplierContacts, SupplierLocations } from "./components";
import type { ListItem } from "~/types";

type SupplierFormProps = {
  initialValues: TypeOfValidator<typeof supplierValidator>;
  contacts?: SupplierContact[];
  locations?: SupplierLocation[];
};

const SupplierForm = ({
  initialValues,
  contacts,
  locations,
}: SupplierFormProps) => {
  const permissions = usePermissions();
  const navigate = useNavigate();
  const onClose = () => navigate("/x/purchasing/suppliers");

  const routeData = useRouteData<{
    supplierTypes: SupplierType[];
    supplierStatuses: SupplierStatus[];
    paymentTerms: ListItem[];
    shippingMethods: ListItem[];
    shippingTerms: ListItem[];
  }>("/x/purchasing/suppliers");

  const supplierTypeOptions = routeData?.supplierTypes
    ? mapRowsToOptions({
        data: routeData.supplierTypes,
        value: "id",
        label: "name",
      })
    : [];

  const supplierStatusOptions = routeData?.supplierStatuses
    ? mapRowsToOptions({
        data: routeData.supplierStatuses,
        value: "id",
        label: "name",
      })
    : [];

  const paymentTermOptions = routeData?.paymentTerms
    ? mapRowsToOptions({
        data: routeData.paymentTerms,
        value: "id",
        label: "name",
      })
    : [];

  const shippingMethodOptions = routeData?.shippingMethods
    ? mapRowsToOptions({
        data: routeData.shippingMethods,
        value: "id",
        label: "name",
      })
    : [];

  const shippingTermOptions = routeData?.shippingTerms
    ? mapRowsToOptions({
        data: routeData.shippingTerms,
        value: "id",
        label: "name",
      })
    : [];

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
            ? `/x/purchasing/suppliers/${initialValues.id}`
            : "/x/purchasing/suppliers/new"
        }
        validator={supplierValidator}
        defaultValues={initialValues}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {isEditing ? initialValues.name : "New Supplier"}
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
                      name="supplierTypeId"
                      label="Supplier Type"
                      options={supplierTypeOptions}
                      placeholder="Select Supplier Type"
                    />
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
                  </Grid>
                </VStack>
              </Box>
              <VStack spacing={8} w="full" alignItems="start" py={[8, 8, 0]}>
                <SupplierLocations
                  locations={locations}
                  isEditing={isEditing}
                />
                <SupplierContacts
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

export default SupplierForm;
