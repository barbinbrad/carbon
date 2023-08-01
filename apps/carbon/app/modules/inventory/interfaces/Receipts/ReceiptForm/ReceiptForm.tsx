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
} from "@chakra-ui/react";
import { useNavigate } from "@remix-run/react";
import { useState } from "react";
import { ValidatedForm } from "remix-validated-form";
import {
  DatePicker,
  Hidden,
  Input,
  Select,
  SelectControlled,
  Submit,
} from "~/components/Form";
import DataGrid from "~/components/Grid";
import { usePermissions, useRouteData } from "~/hooks";
import type {
  ReceiptListItem,
  ReceiptSourceDocument,
} from "~/modules/inventory";
import {
  receiptValidator,
  receiptSourceDocumentType,
} from "~/modules/inventory";
import type { ListItem } from "~/types";
import type { TypeOfValidator } from "~/types/validators";
import useReceiptForm from "./useReceiptForm";

type ReceiptFormProps = {
  initialValues: TypeOfValidator<typeof receiptValidator>;
};

const ReceiptForm = ({ initialValues }: ReceiptFormProps) => {
  const permissions = usePermissions();
  const navigate = useNavigate();
  const onClose = () => navigate(-1);

  const routeData = useRouteData<{
    suppliers: ListItem[];
    locations: ListItem[];
  }>("/x/inventory/receipts");

  const [locationId, setLocationId] = useState<string | null>(
    initialValues.locationId ?? null
  );
  const [supplierId, setSupplierId] = useState<string | null>(
    initialValues.supplierId ?? null
  );

  const [sourceDocument, setSourceDocument] = useState<ReceiptSourceDocument>(
    initialValues.sourceDocument
  );

  const [sourceDocumentId, setSourceDocumentId] = useState<string | null>(
    initialValues.sourceDocumentId ?? null
  );

  const { sourceDocuments } = useReceiptForm({
    sourceDocument,
    sourceDocumentId,
    setLocationId,
    setSourceDocument,
    setSourceDocumentId,
    setSupplierId,
  });

  const isEditing = initialValues.id !== undefined;
  const isDisabled = isEditing
    ? !permissions.can("update", "inventory")
    : !permissions.can("create", "inventory");

  return (
    <Drawer onClose={onClose} isOpen={true} size="full">
      <ValidatedForm
        validator={receiptValidator}
        method="post"
        action={
          isEditing
            ? `/x/inventory/receipts/${initialValues.id}`
            : "/x/inventory/receipts/new"
        }
        defaultValues={initialValues}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>{isEditing ? "Edit" : "New"} Receipt</DrawerHeader>
          <DrawerBody pb={8}>
            <Grid
              gridTemplateColumns={["1fr", "1fr", "5fr 2fr"]}
              gridColumnGap={8}
              w="full"
            >
              <Box w="full">
                <Hidden name="id" />
                <VStack spacing={4} w="full" alignItems="start" minH="full">
                  <Grid
                    gridTemplateColumns={["1fr", "1fr", "1fr 1fr"]}
                    gridColumnGap={8}
                    gridRowGap={4}
                    w="full"
                  >
                    <Input name="receiptId" label="Receipt ID" isDisabled />
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
                      onChange={(newValue) => setLocationId(newValue as string)}
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
                    />
                    <SelectControlled
                      name="sourceDocumentId"
                      label="Source Document ID"
                      options={sourceDocuments.map((d) => ({
                        label: d.name,
                        value: d.id,
                      }))}
                      value={sourceDocumentId ?? undefined}
                      onChange={(newValue) =>
                        setSourceDocumentId(newValue as string)
                      }
                    />
                    <DatePicker name="postingDate" label="Posting Date" />
                    <SelectControlled
                      name="supplierId"
                      label="Supplier"
                      options={
                        routeData?.suppliers?.map((l) => ({
                          label: l.name,
                          value: l.id,
                        })) ?? []
                      }
                      value={supplierId ?? undefined}
                      onChange={(newValue) => console.log(newValue)}
                      isReadOnly
                    />
                  </Grid>
                  <DataGrid<ReceiptListItem>
                    data={[]}
                    columns={[
                      {
                        id: "partId",
                        header: "Part",
                        cell: (item) => item.getValue(),
                      },
                    ]}
                    canEdit={true}
                    editableComponents={{}}
                  />
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
