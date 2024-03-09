import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  HStack,
  VStack,
} from "@carbon/react";
import { ValidatedForm } from "@carbon/remix-validated-form";
import { useNavigate } from "@remix-run/react";
import { useState } from "react";
import type { z } from "zod";
import { Hidden, Input, Number, Select, Submit } from "~/components/Form";
import { usePermissions } from "~/hooks";
import type { PaymentTermCalculationMethod } from "~/modules/accounting";
import { paymentTermValidator } from "~/modules/accounting";
import { path } from "~/utils/path";

type PaymentTermFormProps = {
  initialValues: z.infer<typeof paymentTermValidator>;
};

const PaymentTermForm = ({ initialValues }: PaymentTermFormProps) => {
  const permissions = usePermissions();
  const navigate = useNavigate();
  const onClose = () => navigate(-1);

  const isEditing = initialValues.id !== undefined;
  const isDisabled = isEditing
    ? !permissions.can("update", "accounting")
    : !permissions.can("create", "accounting");

  const [selectedCalculationMethod, setSelectedCalculationMethod] = useState(
    initialValues.calculationMethod
  );

  const calculationMethodOptions = ["Net", "End of Month", "Day of Month"].map(
    (v) => ({
      label: v,
      value: v,
    })
  );

  return (
    <Drawer
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DrawerContent>
        <ValidatedForm
          validator={paymentTermValidator}
          method="post"
          action={
            isEditing
              ? path.to.paymentTerm(initialValues.id!)
              : path.to.newPaymentTerm
          }
          defaultValues={initialValues}
          className="flex flex-col h-full"
        >
          <DrawerHeader>
            <DrawerTitle>{isEditing ? "Edit" : "New"} Payment Term</DrawerTitle>
          </DrawerHeader>
          <DrawerBody>
            <Hidden name="id" />
            <VStack spacing={4}>
              <Input name="name" label="Name" />
              <Select
                name="calculationMethod"
                label="After"
                options={calculationMethodOptions}
                onChange={(value) => {
                  setSelectedCalculationMethod(
                    value?.value as PaymentTermCalculationMethod
                  );
                }}
              />
              <Number
                name="daysDue"
                label={`Due Days after ${selectedCalculationMethod}`}
                minValue={0}
                helperText="The amount of days after the calculation method that the payment is due"
              />
              <Number
                name="daysDiscount"
                label={`Discount Days after ${selectedCalculationMethod}`}
                minValue={0}
                helperText="The amount of days after the calculation method that the cash discount is available"
              />
              <Number
                name="discountPercentage"
                label="Discount Percent"
                minValue={0}
                maxValue={100}
                helperText="The percentage of the cash discount. Use 0 for no discount."
              />
            </VStack>
          </DrawerBody>
          <DrawerFooter>
            <HStack>
              <Submit isDisabled={isDisabled}>Save</Submit>
              <Button variant="solid" onClick={onClose}>
                Cancel
              </Button>
            </HStack>
          </DrawerFooter>
        </ValidatedForm>
      </DrawerContent>
    </Drawer>
  );
};

export default PaymentTermForm;
