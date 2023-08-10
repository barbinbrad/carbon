import { Menubar, MenubarItem } from "@carbon/react";
import {
  Button,
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Heading,
  HStack,
  Grid,
  VStack,
  FormLabel,
} from "@chakra-ui/react";
import { useMatches, useNavigate } from "@remix-run/react";
import { useState } from "react";
import { ValidatedForm } from "remix-validated-form";
import {
  Hidden,
  Input,
  Select,
  SelectControlled,
  Submit,
} from "~/components/Form";
import DataGrid from "~/components/Grid";
import { usePermissions, useRouteData } from "~/hooks";
import type { ReceiptLine, ReceiptSourceDocument } from "~/modules/inventory";
import {
  receiptValidator,
  receiptSourceDocumentType,
} from "~/modules/inventory";
import type { ListItem } from "~/types";
import type { TypeOfValidator } from "~/types/validators";
import useReceiptForm from "./useReceiptForm";

type ReceiptFormProps = {
  initialValues: TypeOfValidator<typeof receiptValidator>;
  isPosted: boolean;
  receiptItems?: ReceiptLine[];
};

const ReceiptForm = ({
  initialValues,
  isPosted,
  receiptItems,
}: ReceiptFormProps) => {
  const isEditing = !useMatches().some(({ pathname }) =>
    pathname.includes("new")
  );

  const permissions = usePermissions();
  const navigate = useNavigate();

  const routeData = useRouteData<{
    locations: ListItem[];
  }>("/x/inventory/receipts");

  const [internalReceiptItems, setReceiptItems] = useState<ReceiptLine[]>(
    receiptItems ?? []
  );

  const [locationId, setLocationId] = useState<string | null>(
    initialValues.locationId ?? null
  );
  const [supplierId, setSupplierId] = useState<string | null>(
    initialValues.supplierId ?? null
  );

  const [sourceDocument, setSourceDocument] = useState<ReceiptSourceDocument>(
    initialValues.sourceDocument ?? "Purchase Order"
  );

  const [sourceDocumentId, setSourceDocumentId] = useState<string | null>(
    initialValues.sourceDocumentId ?? null
  );

  const {
    deleteReceipt,
    editableComponents,
    receiptItemColumns,
    sourceDocuments,
  } = useReceiptForm({
    receipt: initialValues,
    locations: routeData?.locations ?? [],
    sourceDocument,
    sourceDocumentId,
    setLocationId,
    setReceiptItems,
    setSourceDocument,
    setSourceDocumentId,
    setSupplierId,
  });

  const onClose = () => {
    if (!sourceDocumentId && initialValues.id) {
      deleteReceipt(initialValues.id);
    }
    navigate(-1);
  };

  const isDisabled = !permissions.can("update", "inventory");

  return (
    <Drawer onClose={onClose} isOpen={true} size="full">
      <ValidatedForm
        validator={receiptValidator}
        method="post"
        action={
          isEditing
            ? `/x/inventory/receipts/${initialValues.id}`
            : `/x/inventory/receipts/new`
        }
        defaultValues={initialValues}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>{initialValues.receiptId}</DrawerHeader>
          <DrawerBody pb={8}>
            <VStack spacing={4} w="full" alignItems="start">
              <Menubar mb={2} mt={-2}>
                <MenubarItem
                  onClick={() => alert("post")}
                  isDisabled={internalReceiptItems.length === 0 || isPosted}
                >
                  Post Receipt
                </MenubarItem>
              </Menubar>
              <Grid
                gridTemplateColumns={["1fr", "1fr", "5fr 2fr"]}
                gridColumnGap={8}
                w="full"
              >
                <Box w="full">
                  <Hidden name="id" />
                  <Hidden
                    name="sourceDocumentReadableId"
                    value={
                      sourceDocuments.find((d) => d.id === sourceDocumentId)
                        ?.name ?? ""
                    }
                  />
                  <Hidden name="supplierId" value={supplierId ?? ""} />
                  <VStack spacing={4} w="full" alignItems="start" minH="full">
                    <Grid
                      gridTemplateColumns={["1fr", "1fr", "1fr 1fr"]}
                      gridColumnGap={8}
                      gridRowGap={4}
                      w="full"
                    >
                      <Input name="receiptId" label="Receipt ID" isReadOnly />
                      <SelectControlled
                        name="locationId"
                        label="Location"
                        options={
                          routeData?.locations?.map((l) => ({
                            label: l.name,
                            value: l.id,
                          })) ?? []
                        }
                        value={locationId ?? undefined}
                        onChange={(newValue) =>
                          setLocationId(newValue as string)
                        }
                        isReadOnly={isPosted}
                      />
                      <Select
                        name="sourceDocument"
                        label="Source Document"
                        options={receiptSourceDocumentType.map((v) => ({
                          label: v,
                          value: v,
                        }))}
                        onChange={(newValue) => {
                          setSourceDocument(
                            newValue.value as ReceiptSourceDocument
                          );
                          setSourceDocumentId(null);
                        }}
                        isReadOnly={isPosted}
                      />
                      <SelectControlled
                        name="sourceDocumentId"
                        label="Source Document ID"
                        options={sourceDocuments.map((d) => ({
                          label: d.name,
                          value: d.id,
                        }))}
                        value={sourceDocumentId ?? undefined}
                        onChange={(newValue) => {
                          setSourceDocumentId(newValue as string);
                        }}
                        isReadOnly={isPosted}
                      />
                    </Grid>
                  </VStack>
                </Box>
                <VStack spacing={8} w="full" alignItems="start" py={[8, 8, 0]}>
                  {/* TODO: notes component */}
                  <VStack alignItems="start" w="full" spacing={4} mb={4}>
                    <HStack w="full" justifyContent="flex-start">
                      <Heading size="md">Notes</Heading>
                    </HStack>
                  </VStack>
                  {/* end notes component */}
                </VStack>
              </Grid>
              <VStack w="full" alignItems="start">
                <FormLabel>Receipt Lines</FormLabel>
                <DataGrid<ReceiptLine>
                  data={internalReceiptItems}
                  columns={receiptItemColumns}
                  canEdit={!isPosted}
                  editableComponents={editableComponents}
                />
              </VStack>
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

export default ReceiptForm;