import { Select } from "@carbon/react";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { useFetcher, useNavigate } from "@remix-run/react";
import { useEffect, useMemo } from "react";
import { useControlField, useField, ValidatedForm } from "remix-validated-form";
import { Abilities, Number, Submit, Supplier } from "~/components/Form";
import { usePermissions } from "~/hooks";
import type { getSupplierContacts } from "~/modules/purchasing";
import { contractorValidator } from "~/modules/resources";
import type { TypeOfValidator } from "~/types/validators";
import { mapRowsToOptions } from "~/utils/form";

type ContractorFormProps = {
  initialValues: TypeOfValidator<typeof contractorValidator>;
};

const ContractorForm = ({ initialValues }: ContractorFormProps) => {
  const permissions = usePermissions();
  const navigate = useNavigate();
  const onClose = () => navigate(-1);

  const isEditing = initialValues.id !== "";
  const isDisabled = isEditing
    ? !permissions.can("update", "resources")
    : !permissions.can("create", "resources");

  const supplierContactsFetcher =
    useFetcher<Awaited<ReturnType<typeof getSupplierContacts>>>();

  const onSupplierChange = ({ value }: { value: string | number }) => {
    if (value)
      supplierContactsFetcher.load(
        `/api/purchasing/supplier-contacts?supplierId=${value}`
      );
  };

  useEffect(() => {
    if (initialValues.supplierId)
      supplierContactsFetcher.load(
        `/api/purchasing/supplier-locations?supplierId=${initialValues.supplierId}`
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const supplierContacts = useMemo(
    () =>
      mapRowsToOptions({
        data: supplierContactsFetcher.data?.data ?? [],
        value: "id",
        // @ts-ignore
        label: (row) => `${row.contact.firstName} ${row.contact.lastName}`,
      }),
    [supplierContactsFetcher.data]
  );

  return (
    <Drawer onClose={onClose} isOpen={true} size="sm">
      <ValidatedForm
        validator={contractorValidator}
        method="post"
        action={
          isEditing
            ? `/x/resources/contractors/${initialValues.id}`
            : "/x/resources/contractors/new"
        }
        defaultValues={initialValues}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>{isEditing ? "Edit" : "New"} Contractor</DrawerHeader>
          <DrawerBody pb={8}>
            <VStack spacing={4} alignItems="start">
              <Supplier
                name="supplierId"
                label="Supplier"
                isReadOnly={isEditing}
                onChange={onSupplierChange}
              />
              <SupplierContactsBySupplier
                supplierContacts={supplierContacts}
                initialContact={initialValues.id}
                isReadOnly={isEditing}
              />
              <Abilities name="abilities" label="Abilities" />
              <Number
                name="hoursPerWeek"
                label="Hours per Week"
                helperText="The number of hours per week the supplier is available to work."
                min={0}
                max={10000}
              />
            </VStack>
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
const SUPPLIER_CONTACT_FIELD = "id";

const SupplierContactsBySupplier = ({
  supplierContacts,
  initialContact,
  isReadOnly,
}: {
  supplierContacts: { value: string | number; label: string }[];
  initialContact?: string;
  isReadOnly: boolean;
}) => {
  const { error, getInputProps } = useField(SUPPLIER_CONTACT_FIELD);

  const [supplierContact, setSupplierContact] = useControlField<{
    value: string | number;
    label: string;
  } | null>(SUPPLIER_CONTACT_FIELD);

  useEffect(() => {
    // if the initial value is in the options, set it, otherwise set to null
    if (supplierContacts) {
      setSupplierContact(
        supplierContacts.find((s) => s.value === initialContact) ?? null
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supplierContacts, initialContact]);

  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={SUPPLIER_CONTACT_FIELD}>Supplier Contact</FormLabel>
      <Select
        {...getInputProps({
          // @ts-ignore
          id: SUPPLIER_CONTACT_FIELD,
        })}
        options={supplierContacts}
        value={supplierContact}
        onChange={setSupplierContact}
        // @ts-ignore
        isReadOnly={isReadOnly}
        w="full"
      />
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};

export default ContractorForm;
