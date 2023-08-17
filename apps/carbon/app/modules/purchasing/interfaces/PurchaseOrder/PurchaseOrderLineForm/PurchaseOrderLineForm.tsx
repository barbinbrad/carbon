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
  FormLabel,
  HStack,
  Input as ChakraInput,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  VStack,
} from "@chakra-ui/react";
import { useFetcher, useNavigate, useParams } from "@remix-run/react";
import { useEffect, useMemo, useState } from "react";
import { ValidatedForm } from "remix-validated-form";
import {
  Account,
  Hidden,
  Number,
  Part,
  Select,
  SelectControlled,
  Submit,
} from "~/components/Form";
import { usePermissions, useRouteData, useUser } from "~/hooks";
import { useSupabase } from "~/lib/supabase";
import type { getShelvesList } from "~/modules/parts";
import type {
  PurchaseOrder,
  PurchaseOrderLineType,
} from "~/modules/purchasing";
import {
  purchaseOrderLineType,
  purchaseOrderLineValidator,
} from "~/modules/purchasing";
import type { ListItem } from "~/types";
import type { TypeOfValidator } from "~/types/validators";

type PurchaseOrderLineFormProps = {
  initialValues: TypeOfValidator<typeof purchaseOrderLineValidator>;
};

const PurchaseOrderLineForm = ({
  initialValues,
}: PurchaseOrderLineFormProps) => {
  const permissions = usePermissions();
  const { supabase } = useSupabase();
  const navigate = useNavigate();
  const { defaults } = useUser();
  const { orderId } = useParams();

  const routeData = useRouteData<{
    locations: ListItem[];
    purchaseOrder: PurchaseOrder;
  }>(`/x/purchase-order/${orderId}`);

  const locations = routeData?.locations ?? [];
  const locationOptions = locations.map((location) => ({
    label: location.name,
    value: location.id,
  }));

  const isEditable = ["Open", "In Review", "In External Review"].includes(
    routeData?.purchaseOrder?.status ?? ""
  );

  const [type, setType] = useState(initialValues.purchaseOrderLineType);
  const [locationId, setLocationId] = useState(defaults.locationId ?? "");
  const [partData, setPartData] = useState<{
    partId: string;
    description: string;
    unitPrice: string;
    uom: string;
    shelfId: string;
  }>({
    partId: initialValues.partId ?? "",
    description: initialValues.description ?? "",
    unitPrice: initialValues.unitPrice?.toString() ?? "0",
    uom: initialValues.unitOfMeasureCode ?? "",
    shelfId: initialValues.shelfId ?? "",
  });

  const shelfFetcher = useFetcher<Awaited<ReturnType<typeof getShelvesList>>>();

  useEffect(() => {
    if (locationId) {
      shelfFetcher.load(`/api/parts/shelf?locationId=${locationId}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationId]);

  const shelfOptions = useMemo(
    () =>
      shelfFetcher.data?.data?.map((shelf) => ({
        label: shelf.id,
        value: shelf.id,
      })) ?? [],
    [shelfFetcher.data]
  );

  const isEditing = initialValues.id !== undefined;
  const isDisabled = !isEditable
    ? true
    : isEditing
    ? !permissions.can("update", "purchasing")
    : !permissions.can("create", "purchasing");

  const purchaseOrderLineTypeOptions = purchaseOrderLineType.map((type) => ({
    label: type,
    value: type,
  }));

  const onClose = () => navigate(-1);

  const onTypeChange = (type: PurchaseOrderLineType) => {
    setType(type);
    setPartData({
      partId: "",
      description: "",
      unitPrice: "0",
      uom: "EA",
      shelfId: "",
    });
  };

  const onPartChange = async (partId: string) => {
    if (!supabase) return;
    const [part, shelf, cost] = await Promise.all([
      supabase
        .from("part")
        .select("name, unitOfMeasureCode")
        .eq("id", partId)
        .single(),
      supabase
        .from("partInventory")
        .select("defaultShelfId")
        .eq("partId", partId)
        .eq("locationId", locationId)
        .maybeSingle(),
      supabase
        .from("partCost")
        .select("unitCost")
        .eq("partId", partId)
        .single(),
    ]);

    setPartData({
      partId,
      description: part.data?.name ?? "",
      unitPrice: cost.data?.unitCost?.toString() ?? "0",
      uom: part.data?.unitOfMeasureCode ?? "EA",
      shelfId: shelf.data?.defaultShelfId ?? "",
    });
  };

  const onLocationChange = async (
    newLocationId: string | number | undefined
  ) => {
    if (!supabase) throw new Error("supabase is not defined");
    if (typeof newLocationId !== "string")
      throw new Error("locationId is not a string");

    setLocationId(newLocationId);
    if (!partData.partId) return;
    const shelf = await supabase
      .from("partInventory")
      .select("defaultShelfId")
      .eq("partId", partData.partId)
      .eq("locationId", newLocationId)
      .maybeSingle();

    setPartData((d) => ({
      ...d,
      shelfId: shelf?.data?.defaultShelfId ?? "",
    }));
  };

  return (
    <Drawer onClose={onClose} isOpen={true} size="sm">
      <ValidatedForm
        defaultValues={initialValues}
        validator={purchaseOrderLineValidator}
        method="post"
        action={
          isEditing
            ? `/x/purchase-order/${orderId}/lines/${initialValues.id}`
            : `/x/purchase-order/${orderId}/lines/new`
        }
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {isEditing ? "Edit" : "New"} Purchase Order Line
          </DrawerHeader>
          <DrawerBody pb={8}>
            <Hidden name="id" />
            <Hidden name="purchaseOrderId" />
            <Hidden name="description" value={partData.description} />
            <VStack spacing={4} alignItems="start">
              <Select
                name="purchaseOrderLineType"
                label="Type"
                options={purchaseOrderLineTypeOptions}
                onChange={({ value }) => {
                  onTypeChange(value as PurchaseOrderLineType);
                }}
              />
              {type === "Part" && (
                <Part
                  name="partId"
                  label="Part"
                  partReplenishmentSystem="Buy"
                  onChange={({ value }) => {
                    onPartChange(value as string);
                  }}
                />
              )}

              {type === "G/L Account" && (
                <Account
                  name="accountNumber"
                  label="Account"
                  onChange={({ label }) => {
                    setPartData({
                      partId: "",
                      description: label,
                      unitPrice: "0",
                      uom: "EA",
                      shelfId: "",
                    });
                  }}
                />
              )}
              {type === "Fixed Asset" && (
                // TODO: implement Fixed Asset
                <Select name="assetId" label="Asset" options={[]} />
              )}
              <FormControl>
                <FormLabel>Description</FormLabel>
                <ChakraInput
                  value={partData.description}
                  onChange={(e) =>
                    setPartData((d) => ({ ...d, description: e.target.value }))
                  }
                />
              </FormControl>
              <Number name="purchaseQuantity" label="Quantity" />
              {/* 
              // TODO: implement this and replace the UoM in PartForm */}
              {/* <UnitOfMeasure name="unitOfMeasureCode" label="Unit of Measure" value={uom} /> */}
              <FormControl>
                <FormLabel htmlFor="unitPrice">Unit Cost</FormLabel>
                <NumberInput
                  name="unitPrice"
                  value={partData.unitPrice}
                  onChange={(value) =>
                    setPartData((d) => ({
                      ...d,
                      unitPrice: value,
                    }))
                  }
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
              <SelectControlled
                name="locationId"
                label="Location"
                options={locationOptions}
                value={locationId}
                onChange={onLocationChange}
              />
              <SelectControlled
                name="shelfId"
                label="Shelf"
                options={shelfOptions}
                value={partData.shelfId}
                onChange={(newValue) =>
                  setPartData((d) => ({ ...d, shelfId: newValue as string }))
                }
              />
            </VStack>
          </DrawerBody>
          <DrawerFooter>
            <HStack>
              <Submit isDisabled={isDisabled}>Save</Submit>
              <Button size="md" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
            </HStack>
          </DrawerFooter>
        </DrawerContent>
      </ValidatedForm>
    </Drawer>
  );
};

export default PurchaseOrderLineForm;
