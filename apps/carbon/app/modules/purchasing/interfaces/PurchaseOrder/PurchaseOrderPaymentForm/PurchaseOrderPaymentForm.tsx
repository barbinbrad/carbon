import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Grid,
  Heading,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { ValidatedForm } from "remix-validated-form";
import {
  Currency,
  Boolean,
  Hidden,
  Supplier,
  SupplierContact,
  SupplierLocation,
  Select,
  Submit,
} from "~/components/Form";
import { usePermissions } from "~/hooks";
import { purchaseOrderPaymentValidator } from "~/modules/purchasing";
import type { ListItem } from "~/types";
import type { TypeOfValidator } from "~/types/validators";

type PurchaseOrderPaymentFormProps = {
  initialValues: TypeOfValidator<typeof purchaseOrderPaymentValidator>;
  paymentTerms: ListItem[];
};

const PurchaseOrderPaymentForm = ({
  initialValues,
  paymentTerms,
}: PurchaseOrderPaymentFormProps) => {
  const permissions = usePermissions();

  const [supplier, setSupplier] = useState<string | undefined>(
    initialValues.invoiceSupplierId
  );

  const paymentTermOptions = paymentTerms.map((term) => ({
    label: term.name,
    value: term.id,
  }));

  return (
    <ValidatedForm
      method="post"
      validator={purchaseOrderPaymentValidator}
      defaultValues={initialValues}
    >
      <Card w="full">
        <CardHeader>
          <Heading size="md">Payment</Heading>
        </CardHeader>
        <CardBody>
          <Hidden name="id" />
          <Grid
            gridTemplateColumns={["1fr", "1fr", "1fr 1fr 1fr"]}
            gridColumnGap={8}
            gridRowGap={2}
            w="full"
          >
            <VStack alignItems="start" spacing={2} w="full">
              <Supplier
                name="invoiceSupplierId"
                label="Invoice Supplier"
                onChange={({ value }) => setSupplier(value as string)}
              />
              <SupplierLocation
                name="invoiceSupplierLocationId"
                label="Invoice Location"
                supplier={supplier}
              />
              <SupplierContact
                name="invoiceSupplierContactId"
                label="Invoice Contact"
                supplier={supplier}
              />
            </VStack>
            <VStack alignItems="start" spacing={2} w="full">
              <Select
                name="paymentTermId"
                label="Payment Terms"
                options={paymentTermOptions}
              />
              <Currency name="currencyCode" label="Currency" />
            </VStack>
            <VStack alignItems="start" spacing={2} w="full">
              <Boolean name="paymentComplete" label="Payment Complete" />
            </VStack>
          </Grid>
        </CardBody>
        <CardFooter>
          <Submit isDisabled={!permissions.can("update", "purchasing")}>
            Save
          </Submit>
        </CardFooter>
      </Card>
    </ValidatedForm>
  );
};

export default PurchaseOrderPaymentForm;
