import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "@remix-run/react";
import { useState } from "react";
import { ValidatedForm } from "remix-validated-form";
import { Hidden, Input, Number, Select, Submit } from "~/components/Form";
import { usePermissions } from "~/hooks";
import type { PaymentTermCalculationMethod } from "~/modules/accounting";
import { paymentTermValidator } from "~/modules/accounting";
import type { TypeOfValidator } from "~/types/validators";
import { path } from "~/utils/path";

type PaymentTermFormProps = {
  initialValues: TypeOfValidator<typeof paymentTermValidator>;
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
    <Drawer onClose={onClose} isOpen={true} size="sm">
      <ValidatedForm
        validator={paymentTermValidator}
        method="post"
        action={
          isEditing
            ? path.to.paymentTerm(initialValues.id!)
            : path.to.newPaymentTerm
        }
        defaultValues={initialValues}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>{isEditing ? "Edit" : "New"} Payment Term</DrawerHeader>
          <DrawerBody pb={8}>
            <Hidden name="id" />
            <VStack spacing={4} alignItems="start">
              <Input name="name" label="Name" />
              <Select
                name="calculationMethod"
                label="After"
                options={calculationMethodOptions}
                onChange={({ value }) => {
                  setSelectedCalculationMethod(
                    value as PaymentTermCalculationMethod
                  );
                }}
              />
              <Number
                name="daysDue"
                label={`Due Days after ${selectedCalculationMethod}`}
                min={0}
                helperText="The amount of days after the calculation method that the payment is due"
              />
              <Number
                name="daysDiscount"
                label={`Discount Days after ${selectedCalculationMethod}`}
                min={0}
                helperText="The amount of days after the calculation method that the cash discount is available"
              />
              <Number
                name="discountPercentage"
                label="Discount Percent"
                min={0}
                max={100}
                helperText="The percentage of the cash discount. Use 0 for no discount."
              />
            </VStack>
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

export default PaymentTermForm;
