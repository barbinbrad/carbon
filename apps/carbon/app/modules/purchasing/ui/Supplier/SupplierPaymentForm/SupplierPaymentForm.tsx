import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Grid,
  Heading,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { ValidatedForm } from "remix-validated-form";
import {
  Currency,
  Hidden,
  Select,
  Submit,
  Supplier,
  SupplierContact,
  SupplierLocation,
} from "~/components/Form";
import { usePermissions, useRouteData } from "~/hooks";
import { supplierPaymentValidator } from "~/modules/purchasing";
import type { ListItem } from "~/types";
import type { TypeOfValidator } from "~/types/validators";
import { path } from "~/utils/path";

type SupplierPaymentFormProps = {
  initialValues: TypeOfValidator<typeof supplierPaymentValidator>;
};

const SupplierPaymentForm = ({ initialValues }: SupplierPaymentFormProps) => {
  const permissions = usePermissions();
  const [supplier, setSupplier] = useState<string | undefined>(
    initialValues.invoiceSupplierId
  );

  const routeData = useRouteData<{
    paymentTerms: ListItem[];
  }>(path.to.supplierRoot);

  const paymentTermOptions =
    routeData?.paymentTerms?.map((term) => ({
      value: term.id,
      label: term.name,
    })) ?? [];

  const isDisabled = !permissions.can("update", "purchasing");

  return (
    <ValidatedForm
      method="post"
      validator={supplierPaymentValidator}
      defaultValues={initialValues}
    >
      <Card w="full">
        <CardHeader>
          <Heading size="md">Supplier Payment</Heading>
        </CardHeader>
        <CardBody>
          <Hidden name="supplierId" />
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
                label="Payment Term"
                options={paymentTermOptions}
              />
              <Currency name="currencyCode" label="Currency" />
            </VStack>
          </Grid>
        </CardBody>
        <CardFooter>
          <HStack spacing={2}>
            <Submit isDisabled={isDisabled}>Save</Submit>
          </HStack>
        </CardFooter>
      </Card>
    </ValidatedForm>
  );
};

export default SupplierPaymentForm;
