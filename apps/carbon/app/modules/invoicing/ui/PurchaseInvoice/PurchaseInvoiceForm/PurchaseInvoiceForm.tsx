import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Grid,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { ValidatedForm } from "remix-validated-form";
import {
  DatePicker,
  Hidden,
  Input,
  SelectControlled,
  Submit,
  Supplier,
  SupplierContact,
  TextArea,
} from "~/components/Form";
import { usePermissions } from "~/hooks";
import {
  purchaseInvoiceStatusType,
  purchaseInvoiceValidator,
} from "~/modules/invoicing";
import type { TypeOfValidator } from "~/types/validators";

type PurchaseInvoiceFormValues = TypeOfValidator<
  typeof purchaseInvoiceValidator
>;

type PurchaseInvoiceFormProps = {
  initialValues: PurchaseInvoiceFormValues;
};

const PurchaseInvoiceForm = ({ initialValues }: PurchaseInvoiceFormProps) => {
  const permissions = usePermissions();
  const [supplier, setSupplier] = useState<string | undefined>(
    initialValues.supplierId
  );
  const isEditing = initialValues.id !== undefined;

  const statusOptions = purchaseInvoiceStatusType.map((status) => ({
    label: status,
    value: status,
  }));

  return (
    <ValidatedForm
      method="post"
      validator={purchaseInvoiceValidator}
      defaultValues={initialValues}
    >
      <Card w="full">
        <CardHeader>
          <Heading size="md">
            {isEditing ? "Purchase Invoice" : "New Purchase Invoice"}
          </Heading>
          {!isEditing && (
            <Text color="gray.500">
              A purchase invoice is a document that specifies the products or
              services purchased by a customer and the corresponding cost.
            </Text>
          )}
        </CardHeader>
        <CardBody>
          <Hidden name="id" />
          <Hidden name="invoiceId" />
          <VStack spacing={2} w="full" alignItems="start">
            <Grid
              gridTemplateColumns={
                isEditing ? ["1fr", "1fr", "1fr 1fr 1fr"] : "1fr"
              }
              gridColumnGap={8}
              gridRowGap={2}
              w="full"
            >
              <VStack alignItems="start" spacing={2} w="full">
                <Supplier
                  name="supplierId"
                  label="Supplier"
                  onChange={(newValue) =>
                    setSupplier(newValue?.value as string | undefined)
                  }
                />
                {isEditing && (
                  <SupplierContact
                    name="supplierContactId"
                    label="Supplier Contact"
                    supplier={supplier}
                  />
                )}
                <Input
                  name="supplierReference"
                  label="Supplier Invoice Number"
                />
              </VStack>
              <VStack alignItems="start" spacing={2} w="full">
                <DatePicker name="dateIssued" label="Invoice Date" />

                {isEditing && (
                  <SelectControlled
                    name="status"
                    label="Status"
                    value={initialValues.status}
                    options={statusOptions}
                    isReadOnly={permissions.can("delete", "invoicing")}
                  />
                )}
              </VStack>
              <VStack alignItems="start" spacing={2} w="full">
                {isEditing && (
                  <>
                    <TextArea name="notes" label="Notes" />
                  </>
                )}
              </VStack>
            </Grid>
          </VStack>
        </CardBody>
        <CardFooter>
          <Submit
            isDisabled={
              isEditing
                ? !permissions.can("update", "invoicing")
                : !permissions.can("create", "invoicing")
            }
          >
            Save
          </Submit>
        </CardFooter>
      </Card>
    </ValidatedForm>
  );
};

export default PurchaseInvoiceForm;
