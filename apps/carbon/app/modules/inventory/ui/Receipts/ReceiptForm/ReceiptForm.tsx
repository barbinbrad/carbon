import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  HStack,
  Menubar,
  MenubarItem,
  VStack,
} from "@carbon/react";
import { ValidatedForm } from "@carbon/remix-validated-form";
import { Outlet } from "@remix-run/react";
import type { z } from "zod";
import {
  ComboboxControlled,
  Hidden,
  Input,
  Select,
  Submit,
} from "~/components/Form";
import DataGrid from "~/components/Grid";
import { SectionTitle } from "~/components/Layout";
import type {
  ReceiptLine,
  ReceiptSourceDocument,
  receiptStatusType,
} from "~/modules/inventory";
import {
  ReceiptStatus,
  receiptSourceDocumentType,
  receiptValidator,
} from "~/modules/inventory";
import type { Note } from "~/modules/shared";
import { Notes } from "~/modules/shared";
import { path } from "~/utils/path";
import useReceiptForm from "./useReceiptForm";

type ReceiptFormProps = {
  initialValues: z.infer<typeof receiptValidator>;
  status: (typeof receiptStatusType)[number];
  notes: Note[];
  receiptLines?: ReceiptLine[];
};

const formId = "receipt-form";

const ReceiptForm = ({
  initialValues,
  status,
  notes,
  receiptLines,
}: ReceiptFormProps) => {
  const {
    editableComponents,
    locationId,
    locations,
    internalReceiptLines,
    canPost,
    isDisabled,
    receiptLineColumns,
    sourceDocumentId,
    supplierId,
    sourceDocuments,
    onClose,
    onPost,
    setLocationId,
    setReceiptLines,
    setSourceDocument,
    setSourceDocumentId,
  } = useReceiptForm({
    receipt: initialValues,
    receiptLines: receiptLines ?? [],
  });

  const isPosted = status === "Posted";

  return (
    <>
      <Drawer
        open
        onOpenChange={(open) => {
          if (!open) onClose();
        }}
      >
        <DrawerContent size="full">
          <DrawerHeader>
            <DrawerTitle>{initialValues.receiptId}</DrawerTitle>
            <DrawerDescription>
              <ReceiptStatus status={status} />
            </DrawerDescription>
          </DrawerHeader>
          <DrawerBody>
            <VStack spacing={4}>
              <Menubar className="mb-2 mt--2">
                <MenubarItem isDisabled={!canPost || isPosted} onClick={onPost}>
                  Post
                </MenubarItem>
              </Menubar>

              <div className="w-full">
                <ValidatedForm
                  id={formId}
                  validator={receiptValidator}
                  method="post"
                  action={path.to.receipt(initialValues.id)}
                  defaultValues={initialValues}
                  style={{ width: "100%" }}
                >
                  <Hidden name="id" />
                  <Hidden
                    name="sourceDocumentReadableId"
                    value={
                      sourceDocuments.find((d) => d.id === sourceDocumentId)
                        ?.name ?? ""
                    }
                  />
                  <Hidden name="supplierId" value={supplierId ?? ""} />
                  <VStack spacing={4} className="min-h-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 w-full">
                      <Input name="receiptId" label="Receipt ID" isReadOnly />
                      <ComboboxControlled
                        name="locationId"
                        label="Location"
                        options={
                          locations.map((l) => ({
                            label: l.name,
                            value: l.id,
                          })) ?? []
                        }
                        value={locationId ?? undefined}
                        onChange={(newValue) => {
                          if (newValue) setLocationId(newValue.value as string);
                        }}
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
                          if (newValue) {
                            setSourceDocument(
                              newValue.value as ReceiptSourceDocument
                            );
                            setSourceDocumentId(null);
                          }
                        }}
                        isReadOnly={isPosted}
                      />
                      <ComboboxControlled
                        name="sourceDocumentId"
                        label="Source Document ID"
                        options={sourceDocuments.map((d) => ({
                          label: d.name,
                          value: d.id,
                        }))}
                        value={sourceDocumentId ?? undefined}
                        onChange={(newValue) => {
                          if (newValue) {
                            setSourceDocumentId(newValue.value as string);
                          }
                        }}
                        isReadOnly={isPosted}
                      />
                      <Input
                        name="externalDocumentId"
                        label="External Reference"
                      />
                    </div>
                    {/* <CustomFormFields table="receipt" />*/}
                  </VStack>
                </ValidatedForm>
              </div>

              <VStack>
                <SectionTitle>Receipt Lines</SectionTitle>
                <DataGrid<ReceiptLine>
                  data={internalReceiptLines}
                  columns={receiptLineColumns}
                  canEdit={!isPosted}
                  contained={false}
                  editableComponents={editableComponents}
                  onDataChange={setReceiptLines}
                />
              </VStack>
              <SectionTitle>Notes</SectionTitle>
              <Notes notes={notes} documentId={initialValues.id} />
            </VStack>
          </DrawerBody>
          <DrawerFooter>
            <HStack>
              <Submit formId={formId} isDisabled={isDisabled}>
                Save
              </Submit>
              <Button size="md" variant="solid" onClick={onClose}>
                Cancel
              </Button>
            </HStack>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <Outlet />
    </>
  );
};

export default ReceiptForm;
