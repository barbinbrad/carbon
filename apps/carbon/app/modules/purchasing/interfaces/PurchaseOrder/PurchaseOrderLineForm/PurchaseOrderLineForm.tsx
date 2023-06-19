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
import { useNavigate, useParams } from "@remix-run/react";
import { useState } from "react";
import { ValidatedForm } from "remix-validated-form";
import {
  Account,
  Hidden,
  Number,
  Part,
  Select,
  Submit,
} from "~/components/Form";
import { usePermissions } from "~/hooks";
import { useSupabase } from "~/lib/supabase";
import type { PurchaseOrderLineType } from "~/modules/purchasing";
import { purchaseOrderLineValidator } from "~/modules/purchasing";
import type { TypeOfValidator } from "~/types/validators";

type PurchaseOrderLineFormProps = {
  initialValues: TypeOfValidator<typeof purchaseOrderLineValidator>;
  purchaseOrderLineTypes: PurchaseOrderLineType[];
};

const PurchaseOrderLineForm = ({
  initialValues,
  purchaseOrderLineTypes,
}: PurchaseOrderLineFormProps) => {
  const permissions = usePermissions();
  const { supabase } = useSupabase();
  const navigate = useNavigate();
  const { orderId } = useParams();

  const [type, setType] = useState(initialValues.purchaseOrderLineType);
  const [partData, setPartData] = useState<{
    description: string;
    unitPrice: string;
    uom: string;
    shelf: string;
  }>({
    description: initialValues.description ?? "",
    unitPrice: initialValues.unitPrice?.toString() ?? "0",
    uom: initialValues.unitOfMeasureCode ?? "",
    shelf: initialValues.shelf ?? "",
  });

  const isEditing = initialValues.id !== undefined;
  const isDisabled = isEditing
    ? !permissions.can("update", "purchasing")
    : !permissions.can("create", "purchasing");

  const purchaseOrderLineTypeOptions = purchaseOrderLineTypes.map((type) => ({
    label: type,
    value: type,
  }));

  const onClose = () => navigate(-1);

  const onTypeChange = (type: PurchaseOrderLineType) => {
    setType(type);
    setPartData({
      description: "",
      unitPrice: "0",
      uom: "EA",
      shelf: "",
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
        .select("shelfId")
        .eq("partId", partId)
        .single(),
      supabase
        .from("partCost")
        .select("unitCost")
        .eq("partId", partId)
        .single(),
    ]);

    setPartData({
      description: part.data?.name ?? "",
      unitPrice: cost.data?.unitCost?.toString() ?? "0",
      uom: part.data?.unitOfMeasureCode ?? "EA",
      shelf: shelf.data?.shelfId ?? "",
    });
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
                      description: label,
                      unitPrice: "0",
                      uom: "EA",
                      shelf: "",
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
              {/* 
              // TODO: 
              <Shelf name="shelf" label="Shelf" value={shelf}/> */}
            </VStack>
          </DrawerBody>
          <DrawerFooter>
            <HStack>
              <Submit isDisabled={isDisabled}>Save</Submit>
              <Button variant="ghost" onClick={onClose}>
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
