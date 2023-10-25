import { Select, useMount } from "@carbon/react";
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
import type { getSupplierLocations } from "~/modules/purchasing";
import { partnerValidator } from "~/modules/resources";
import type { TypeOfValidator } from "~/types/validators";
import { path } from "~/utils/path";

type PartnerFormProps = {
  initialValues: TypeOfValidator<typeof partnerValidator>;
};

const PartnerForm = ({ initialValues }: PartnerFormProps) => {
  const permissions = usePermissions();
  const navigate = useNavigate();
  const onClose = () => navigate(-1);

  const isEditing = initialValues.id !== "";
  const isDisabled = isEditing
    ? !permissions.can("update", "resources")
    : !permissions.can("create", "resources");

  const supplierLocationFetcher =
    useFetcher<Awaited<ReturnType<typeof getSupplierLocations>>>();

  const onSupplierChange = ({ value }: { value: string | number }) => {
    if (value)
      supplierLocationFetcher.load(path.to.api.supplierLocations(`${value}`));
  };

  useMount(() => {
    if (initialValues.supplierId)
      supplierLocationFetcher.load(
        path.to.api.supplierLocations(initialValues.supplierId)
      );
  });

  const supplierLocations = useMemo(
    () =>
      supplierLocationFetcher.data?.data?.map((loc) => ({
        value: loc.id,
        label: `${loc.address?.city}, ${loc.address?.state}`,
      })) ?? [],
    [supplierLocationFetcher.data]
  );

  return (
    <Drawer onClose={onClose} isOpen={true} size="sm">
      <ValidatedForm
        validator={partnerValidator}
        method="post"
        action={
          isEditing ? path.to.partner(initialValues.id) : path.to.newPartner
        }
        defaultValues={initialValues}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>{isEditing ? "Edit" : "New"} Partner</DrawerHeader>
          <DrawerBody pb={8}>
            <VStack spacing={4} alignItems="start">
              <Supplier
                name="supplierId"
                label="Supplier"
                isReadOnly={isEditing}
                onChange={onSupplierChange}
              />
              <SupplierLocationsBySupplier
                supplierLocations={supplierLocations}
                initialLocation={initialValues.id}
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

const SUPPLIER_LOCATION_FIELD = "id";

const SupplierLocationsBySupplier = ({
  supplierLocations,
  initialLocation,
  isReadOnly,
}: {
  supplierLocations: { value: string | number; label: string }[];
  initialLocation?: string;
  isReadOnly: boolean;
}) => {
  const { error, getInputProps } = useField(SUPPLIER_LOCATION_FIELD);

  const [supplierLocation, setSupplierLocation] = useControlField<{
    value: string | number;
    label: string;
  } | null>(SUPPLIER_LOCATION_FIELD);

  useEffect(() => {
    // if the initial value is in the options, set it, otherwise set to null
    if (supplierLocations) {
      setSupplierLocation(
        supplierLocations.find((s) => s.value === initialLocation) ?? null
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supplierLocations, initialLocation]);

  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={SUPPLIER_LOCATION_FIELD}>Supplier Location</FormLabel>
      <Select
        {...getInputProps({
          // @ts-ignore
          id: SUPPLIER_LOCATION_FIELD,
        })}
        options={supplierLocations}
        value={supplierLocation}
        onChange={setSupplierLocation}
        isReadOnly={isReadOnly}
      />
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};

export default PartnerForm;
