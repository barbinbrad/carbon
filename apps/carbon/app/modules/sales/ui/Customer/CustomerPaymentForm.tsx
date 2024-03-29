import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  HStack,
} from "@carbon/react";
import { ValidatedForm } from "@carbon/remix-validated-form";
import { useState } from "react";
import type { z } from "zod";
import {
  Currency,
  CustomFormFields,
  Customer,
  CustomerContact,
  CustomerLocation,
  Hidden,
  Select,
  Submit,
} from "~/components/Form";
import { usePermissions, useRouteData } from "~/hooks";
import { customerPaymentValidator } from "~/modules/sales";
import type { ListItem } from "~/types";
import { path } from "~/utils/path";

type CustomerPaymentFormProps = {
  initialValues: z.infer<typeof customerPaymentValidator>;
};

const CustomerPaymentForm = ({ initialValues }: CustomerPaymentFormProps) => {
  const permissions = usePermissions();
  const [customer, setCustomer] = useState<string | undefined>(
    initialValues.invoiceCustomerId
  );

  const routeData = useRouteData<{
    paymentTerms: ListItem[];
  }>(path.to.customerRoot);

  const paymentTermOptions =
    routeData?.paymentTerms?.map((term) => ({
      value: term.id,
      label: term.name,
    })) ?? [];

  const isDisabled = !permissions.can("update", "sales");

  return (
    <ValidatedForm
      method="post"
      validator={customerPaymentValidator}
      defaultValues={initialValues}
    >
      <Card>
        <CardHeader>
          <CardTitle>Customer Payment</CardTitle>
        </CardHeader>
        <CardContent>
          <Hidden name="customerId" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-2 w-full">
            <Customer
              name="invoiceCustomerId"
              label="Invoice Customer"
              onChange={(value) => setCustomer(value?.value as string)}
            />
            <CustomerLocation
              name="invoiceCustomerLocationId"
              label="Invoice Location"
              customer={customer}
            />
            <CustomerContact
              name="invoiceCustomerContactId"
              label="Invoice Contact"
              customer={customer}
            />

            <Select
              name="paymentTermId"
              label="Payment Term"
              options={paymentTermOptions}
            />
            <Currency name="currencyCode" label="Currency" />
            <CustomFormFields table="customerPayment" />
          </div>
        </CardContent>
        <CardFooter>
          <HStack>
            <Submit isDisabled={isDisabled}>Save</Submit>
          </HStack>
        </CardFooter>
      </Card>
    </ValidatedForm>
  );
};

export default CustomerPaymentForm;
