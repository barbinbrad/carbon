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
  Boolean,
  Customer,
  CustomerLocation,
  DatePicker,
  Hidden,
  Input,
  Select,
  Submit,
  TextArea,
} from "~/components/Form";
import { usePermissions } from "~/hooks";
import { purchaseOrderDeliveryValidator } from "~/modules/purchasing";
import type { ListItem } from "~/types";
import type { TypeOfValidator } from "~/types/validators";

type PurchaseOrderDeliveryFormProps = {
  initialValues: TypeOfValidator<typeof purchaseOrderDeliveryValidator>;
  shippingMethods: ListItem[];
  shippingTerms: ListItem[];
};

const PurchaseOrderDeliveryForm = ({
  initialValues,
  shippingMethods,
  shippingTerms,
}: PurchaseOrderDeliveryFormProps) => {
  const permissions = usePermissions();
  const [dropShip, setDropShip] = useState<boolean>(
    initialValues.dropShipment ?? false
  );
  const [customer, setCustomer] = useState<string | undefined>(
    initialValues.customerId
  );

  const shippingMethodOptions = shippingMethods.map((method) => ({
    label: method.name,
    value: method.id,
  }));

  const shippingTermOptions = shippingTerms.map((term) => ({
    label: term.name,
    value: term.id,
  }));

  return (
    <ValidatedForm
      method="post"
      validator={purchaseOrderDeliveryValidator}
      defaultValues={initialValues}
    >
      <Card w="full">
        <CardHeader>
          <Heading size="md">Delivery</Heading>
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
              <Select
                name="shippingMethodId"
                label="Shipping Method"
                options={shippingMethodOptions}
              />
              <Select
                name="shippingTermId"
                label="Shipping Terms"
                options={shippingTermOptions}
              />
              <Input name="trackingNumber" label="Tracking Number" />
            </VStack>
            <VStack alignItems="start" spacing={2} w="full">
              <DatePicker name="receiptRequestedDate" label="Requested Date" />
              <DatePicker name="receiptPromisedDate" label="Promised Date" />
              <DatePicker name="deliveryDate" label="Delivery Date" />
            </VStack>
            <VStack alignItems="start" spacing={2} w="full">
              <Boolean
                name="dropShipment"
                label="Drop Shipment"
                onChange={setDropShip}
              />
              {dropShip && (
                <>
                  <Customer
                    name="customerId"
                    label="Customer"
                    onChange={({ value }) => setCustomer(value as string)}
                  />
                  <CustomerLocation
                    name="customerLocationId"
                    label="Location"
                    customer={customer}
                  />
                </>
              )}
              <TextArea name="notes" label="Shipping Notes" />
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

export default PurchaseOrderDeliveryForm;
