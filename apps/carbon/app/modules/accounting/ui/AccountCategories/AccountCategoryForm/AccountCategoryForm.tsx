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
import { ValidatedForm } from "remix-validated-form";
import { Hidden, Input, Select, Submit } from "~/components/Form";
import { usePermissions } from "~/hooks";
import {
  accountCategoryValidator,
  incomeBalanceTypes,
  normalBalanceTypes,
} from "~/modules/accounting";
import type { TypeOfValidator } from "~/types/validators";
import { path } from "~/utils/path";

type AccountCategoryFormProps = {
  initialValues: TypeOfValidator<typeof accountCategoryValidator>;
  onClose: () => void;
};

const AccountCategoryForm = ({
  initialValues,
  onClose,
}: AccountCategoryFormProps) => {
  const permissions = usePermissions();

  const isEditing = initialValues.id !== undefined;
  const isDisabled = isEditing
    ? !permissions.can("update", "accounting")
    : !permissions.can("create", "accounting");

  return (
    <Drawer onClose={onClose} isOpen={true} size="sm">
      <ValidatedForm
        validator={accountCategoryValidator}
        method="post"
        action={
          isEditing
            ? path.to.accountingCategory(initialValues.id!)
            : path.to.newAccountingCategory
        }
        defaultValues={initialValues}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {isEditing ? "Edit" : "New"} Account Category
          </DrawerHeader>
          <DrawerBody pb={8}>
            <Hidden name="id" />
            <VStack spacing={2} alignItems="start">
              <Input name="category" label="Category" />
              <Select
                name="incomeBalance"
                label="Income Balance"
                options={incomeBalanceTypes.map((incomeBalance) => ({
                  value: incomeBalance,
                  label: incomeBalance,
                }))}
              />
              <Select
                name="normalBalance"
                label="Normal Balance"
                options={normalBalanceTypes.map((normalBalance) => ({
                  value: normalBalance,
                  label: normalBalance,
                }))}
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

export default AccountCategoryForm;
