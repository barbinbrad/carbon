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
  Hidden,
  Select,
  Submit,
  Supplier,
  SupplierContact,
  SupplierLocation,
} from "~/components/Form";
import { usePermissions, useRouteData } from "~/hooks";
import { supplierShippingValidator } from "~/modules/purchasing";
import type { ListItem } from "~/types";
import type { TypeOfValidator } from "~/types/validators";
import { path } from "~/utils/path";

type SupplierShippingFormProps = {
  initialValues: TypeOfValidator<typeof supplierShippingValidator>;
};

const SupplierShippingForm = ({ initialValues }: SupplierShippingFormProps) => {
  const permissions = usePermissions();
  const [supplier, setSupplier] = useState<string | undefined>(
    initialValues.shippingSupplierId
  );

  const routeData = useRouteData<{
    shippingMethods: ListItem[];
    shippingTerms: ListItem[];
  }>(path.to.supplierRoot);

  const shippingMethodOptions =
    routeData?.shippingMethods?.map((method) => ({
      value: method.id,
      label: method.name,
    })) ?? [];

  const shippingTermOptions =
    routeData?.shippingTerms?.map((term) => ({
      value: term.id,
      label: term.name,
    })) ?? [];

  const isDisabled = !permissions.can("update", "purchasing");

  return (
    <ValidatedForm
      method="post"
      validator={supplierShippingValidator}
      defaultValues={initialValues}
    >
      <Card w="full">
        <CardHeader>
          <Heading size="md">Supplier Shipping</Heading>
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
                name="shippingSupplierId"
                label="Shipping Supplier"
                onChange={({ value }) => setSupplier(value as string)}
              />
              <SupplierLocation
                name="shippingSupplierLocationId"
                label="Shipping Location"
                supplier={supplier}
              />
              <SupplierContact
                name="shippingSupplierContactId"
                label="Shipping Contact"
                supplier={supplier}
              />
            </VStack>
            <VStack alignItems="start" spacing={2} w="full">
              <Select
                name="shippingMethodId"
                label="Shipping Method"
                options={shippingMethodOptions}
              />
              <Select
                name="shippingTermId"
                label="Shipping Term"
                options={shippingTermOptions}
              />
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

export default SupplierShippingForm;
