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
  FormLabel,
  Grid,
  HStack,
  Skeleton,
  Stack,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "@remix-run/react";
import { ValidatedForm } from "remix-validated-form";
import {
  Input,
  Select,
  Submit,
  User,
  TextArea,
  Hidden,
} from "~/components/Form";
import { supplierValidator } from "~/services/purchasing";
import type {
  SupplierContact,
  SupplierLocation,
  SupplierStatus,
  SupplierType,
} from "~/interfaces/Purchasing/types";
import { mapRowsToOptions } from "~/utils/form";
import { useRouteData } from "~/hooks";
import { SupplierContacts, SupplierLocations } from "./components";
import { IoMdAdd } from "react-icons/io";

type SupplierFormProps = {
  initialValues: {
    id?: string;
    name: string;
    description?: string;
    accountManagerId?: string;
    supplierTypeId?: string;
    supplierStatusId?: number;
    taxId?: string;
  };
  contacts?: SupplierContact[];
  locations?: SupplierLocation[];
};

const SupplierForm = ({
  initialValues,
  contacts,
  locations,
}: SupplierFormProps) => {
  const navigate = useNavigate();
  const onClose = () => navigate("/app/purchasing/suppliers");

  const routeData = useRouteData<{
    supplierTypes: { data: SupplierType[] };
    supplierStatuses: { data: SupplierStatus[] };
  }>("/app/purchasing/suppliers");

  const supplierTypeOptions = routeData?.supplierTypes
    ? mapRowsToOptions({
        data: routeData.supplierTypes.data ?? [],
        value: "id",
        label: "name",
      })
    : [];

  const supplierStatusOptions = routeData?.supplierStatuses
    ? mapRowsToOptions({
        data: routeData.supplierStatuses.data ?? [],
        value: "id",
        label: "name",
      })
    : [];

  const isEditing = initialValues.id !== undefined;

  return (
    <Drawer onClose={onClose} isOpen size="full">
      <ValidatedForm
        method="post"
        action={
          isEditing
            ? `/app/purchasing/suppliers/${initialValues.id}`
            : "/app/purchasing/suppliers/new"
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
                    <User name="accountManagerId" label="Account Manager" />
                    <Select
                      name="supplierStatusId"
                      label="Supplier Status"
                      options={supplierStatusOptions}
                      placeholder="Select Supplier Status"
                    />
                  </Grid>

                  <TextArea
                    name="description"
                    label="Description"
                    characterLimit={500}
                    my={2}
                  />
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
              <Submit>Save</Submit>
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
