import { Menubar, MenubarItem } from "@carbon/react";
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
  VStack,
} from "@chakra-ui/react";
import { Outlet } from "@remix-run/react";
import { ValidatedForm } from "remix-validated-form";
import {
  Hidden,
  Input,
  Select,
  SelectControlled,
  Submit,
} from "~/components/Form";
import DataGrid from "~/components/Grid";
import type { ReceiptLine, ReceiptSourceDocument } from "~/modules/inventory";
import {
  receiptSourceDocumentType,
  receiptValidator,
} from "~/modules/inventory";
import type { TypeOfValidator } from "~/types/validators";
import useReceiptForm from "./useReceiptForm";

type ReceiptFormProps = {
  initialValues: TypeOfValidator<typeof receiptValidator>;
  isPosted: boolean;
  receiptLines?: ReceiptLine[];
};

const formId = "receipt-form";

const ReceiptForm = ({
  initialValues,
  isPosted,
  receiptLines,
}: ReceiptFormProps) => {
  const {
    editableComponents,
    locationId,
    locations,
    internalReceiptItems,
    isEditing,
    isDisabled,
    receiptLineColumns,
    sourceDocumentId,
    supplierId,
    sourceDocuments,
    onClose,
    onPost,
    setLocationId,
    setSourceDocument,
    setSourceDocumentId,
  } = useReceiptForm({
    receipt: initialValues,
    receiptLines: receiptLines ?? [],
  });

  return (
    <>
      <Drawer onClose={onClose} isOpen={true} size="full">
        <ValidatedForm
          id={formId}
          validator={receiptValidator}
          method="post"
          action={
            isEditing
              ? `/x/inventory/receipts/${initialValues.id}`
              : `/x/inventory/receipts/new`
          }
          defaultValues={initialValues}
          style={{ width: "100%" }}
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>{initialValues.receiptId}</DrawerHeader>
            <DrawerBody pb={8}>
              <VStack spacing={4} w="full" alignItems="start">
                <Menubar mb={2} mt={-2}>
                  <MenubarItem
                    isDisabled={!isEditing || isPosted}
                    onClick={onPost}
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
                            locations.map((l) => ({
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
                        <Input
                          name="externalDocumentId"
                          label="External Reference"
                        />
                      </Grid>
                    </VStack>
                  </Box>
                  <VStack
                    spacing={8}
                    w="full"
                    alignItems="start"
                    py={[8, 8, 0]}
                  >
                    {/* TODO: notes component */}
                    <VStack alignItems="start" w="full" spacing={4} mb={4}>
                      <HStack w="full" justifyContent="flex-start">
                        <FormLabel>Notes</FormLabel>
                      </HStack>
                    </VStack>
                    {/* end notes component */}
                  </VStack>
                </Grid>
                <VStack w="full" alignItems="start">
                  <FormLabel>Receipt Lines</FormLabel>
                  <DataGrid<ReceiptLine>
                    data={internalReceiptItems}
                    columns={receiptLineColumns}
                    canEdit={!isPosted}
                    contained={false}
                    editableComponents={editableComponents}
                  />
                </VStack>
              </VStack>
            </DrawerBody>
            <DrawerFooter>
              <HStack spacing={2}>
                <Submit formId={formId} isDisabled={isDisabled}>
                  Save
                </Submit>
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
      <Outlet />
    </>
  );
};

export default ReceiptForm;
