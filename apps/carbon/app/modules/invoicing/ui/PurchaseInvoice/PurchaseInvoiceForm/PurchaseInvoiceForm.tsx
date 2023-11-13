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
  Currency,
  DatePicker,
  Hidden,
  Input,
  Select,
  SelectControlled,
  Submit,
  Supplier,
  SupplierContact,
  SupplierLocation,
} from "~/components/Form";
import { usePermissions } from "~/hooks";
import {
  purchaseInvoiceStatusType,
  purchaseInvoiceValidator,
} from "~/modules/invoicing";
import type { ListItem } from "~/types";
import type { TypeOfValidator } from "~/types/validators";

type PurchaseInvoiceFormValues = TypeOfValidator<
  typeof purchaseInvoiceValidator
>;

type PurchaseInvoiceFormProps = {
  initialValues: PurchaseInvoiceFormValues;
  paymentTerms: ListItem[];
};

const PurchaseInvoiceForm = ({
  initialValues,
  paymentTerms,
}: PurchaseInvoiceFormProps) => {
  const permissions = usePermissions();
  const [supplier, setSupplier] = useState<string | undefined>(
    initialValues.supplierId
  );

  const isEditing = initialValues.id !== undefined;

  const statusOptions = purchaseInvoiceStatusType.map((status) => ({
    label: status,
    value: status,
  }));

  const paymentTermOptions = paymentTerms.map((paymentTerm) => ({
    label: paymentTerm.name,
    value: paymentTerm.id,
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
                  isReadOnly={isEditing}
                />
                {isEditing && (
                  <>
                    <Supplier
                      name="invoiceSupplierId"
                      label="Invoice Supplier"
                      onChange={(newValue) =>
                        setSupplier(newValue?.value as string | undefined)
                      }
                    />
                    <SupplierLocation
                      name="invoiceSupplierLocationId"
                      label="Invoice Location"
                      supplier={supplier}
                    />
                    <SupplierContact
                      name="invoiceSupplierContactId"
                      label="Invoice Supplier Contact"
                      supplier={supplier}
                    />
                  </>
                )}
              </VStack>
              <VStack alignItems="start" spacing={2} w="full">
                <Input
                  name="supplierReference"
                  label="Supplier Invoice Number"
                />
                <DatePicker name="dateIssued" label="Date Issued" />
                <DatePicker name="dateDue" label="Due Date" />
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
                    <Select
                      name="paymentTermId"
                      label="Payment Terms"
                      options={paymentTermOptions}
                    />
                    <Currency name="currencyCode" label="Currency" />
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
