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
import { ValidatedForm } from "remix-validated-form";
import {
  Hidden,
  Input,
  Number,
  Select,
  Submit,
  TextArea,
} from "~/components/Form";
import { usePermissions } from "~/hooks";
import { paymentTermValidator } from "~/modules/purchasing";
import type { TypeOfValidator } from "~/types/validators";

type PaymentTermFormProps = {
  initialValues: TypeOfValidator<typeof paymentTermValidator>;
};

const PaymentTermForm = ({ initialValues }: PaymentTermFormProps) => {
  const permissions = usePermissions();
  const navigate = useNavigate();
  const onClose = () => navigate(-1);

  const isEditing = initialValues.id !== undefined;
  const isDisabled = isEditing
    ? !permissions.can("update", "purchasing")
    : !permissions.can("create", "purchasing");

  const calculationMethodOptions = [
    "Transaction Date",
    "End of Month",
    "Day of Month",
  ].map((v) => ({
    label: v,
    value: v,
  }));

  return (
    <Drawer onClose={onClose} isOpen={true} size="sm">
      <ValidatedForm
        validator={paymentTermValidator}
        method="post"
        action={
          isEditing
            ? `/x/purchasing/payment-terms/${initialValues.id}`
            : "/x/purchasing/payment-terms/new"
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
              <Input name="name" label="Payment Term" />
              <TextArea name="description" label="Description" />
              <Number name="daysDue" label="Days Due" min={0} />
              <Number name="daysDiscount" label="Days Discount" min={0} />
              <Number
                name="discountPercentage"
                label="Discount Percent"
                min={0}
              />
              <Number name="gracePeriod" label="Grace Period" min={0} />
              <Select
                name="calculationMethod"
                label="Calculation Method"
                options={calculationMethodOptions}
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
