import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  FormControl,
  FormLabel,
  HStack,
  VStack,
  useMount,
} from "@carbon/react";
import { ValidatedForm, useControlField } from "@carbon/remix-validated-form";
import { useFetcher, useNavigate } from "@remix-run/react";
import { useEffect, useMemo } from "react";
import type { z } from "zod";
import {
  Ability,
  ComboboxControlled,
  Number,
  Submit,
  Supplier,
} from "~/components/Form";
import { usePermissions } from "~/hooks";
import type { getSupplierLocations } from "~/modules/purchasing";
import { partnerValidator } from "~/modules/resources";
import { path } from "~/utils/path";

type PartnerFormProps = {
  initialValues: z.infer<typeof partnerValidator>;
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

  const onSupplierChange = (newValue: { value: string | number } | null) => {
    if (newValue)
      supplierLocationFetcher.load(
        path.to.api.supplierLocations(`${newValue.value}`)
      );
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
    <Drawer
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DrawerContent>
        <ValidatedForm
          validator={partnerValidator}
          method="post"
          action={
            isEditing
              ? path.to.partner(initialValues.id, initialValues.abilityId)
              : path.to.newPartner
          }
          defaultValues={initialValues}
          className="flex flex-col h-full"
        >
          <DrawerHeader>
            <DrawerTitle>{isEditing ? "Edit" : "New"} Partner</DrawerTitle>
            <DrawerDescription>
              A partner is combination of a supplier location and and an ability
              with a certain amount of time available
            </DrawerDescription>
          </DrawerHeader>
          <DrawerBody>
            <VStack spacing={4}>
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
              <Ability name="abilityId" label="Ability" />
              <Number
                name="hoursPerWeek"
                label="Hours per Week"
                helperText="The number of hours per week the supplier is available to work."
                minValue={0}
                maxValue={10000}
              />
              {/* <CustomFormFields table="partner" />*/}
            </VStack>
          </DrawerBody>
          <DrawerFooter>
            <HStack>
              <Submit isDisabled={isDisabled}>Save</Submit>
              <Button size="md" variant="solid" onClick={onClose}>
                Cancel
              </Button>
            </HStack>
          </DrawerFooter>
        </ValidatedForm>
      </DrawerContent>
    </Drawer>
  );
};

const SupplierLocationsBySupplier = ({
  supplierLocations,
  initialLocation,
  isReadOnly,
}: {
  supplierLocations: { value: string; label: string }[];
  initialLocation?: string;
  isReadOnly: boolean;
}) => {
  const [supplierLocation, setSupplierLocation] = useControlField<
    string | null
  >("id");

  useEffect(() => {
    // if the initial value is in the options, set it, otherwise set to null
    if (supplierLocations) {
      setSupplierLocation(
        supplierLocations.find((s) => s.value === initialLocation)?.value ??
          null
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supplierLocations, initialLocation]);

  const onChange = (newValue: { value: string } | null) => {
    setSupplierLocation(newValue?.value ?? null);
  };

  return (
    <FormControl>
      <FormLabel>Supplier Location</FormLabel>
      <ComboboxControlled
        name="id"
        options={supplierLocations}
        value={supplierLocation ?? undefined}
        onChange={onChange}
        isReadOnly={isReadOnly}
      />
    </FormControl>
  );
};

export default PartnerForm;
