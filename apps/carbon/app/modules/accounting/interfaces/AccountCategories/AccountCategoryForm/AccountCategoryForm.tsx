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
import { Input, Hidden, Submit, Select } from "~/components/Form";
import { usePermissions, useRouteData } from "~/hooks";
import type {
  AccountIncomeBalance,
  AccountNormalBalance,
} from "~/modules/accounting";
import { accountCategoryValidator } from "~/modules/accounting";
import type { TypeOfValidator } from "~/types/validators";

type AccountCategoryFormProps = {
  initialValues: TypeOfValidator<typeof accountCategoryValidator>;
  onClose: () => void;
};

const AccountCategoryForm = ({
  initialValues,
  onClose,
}: AccountCategoryFormProps) => {
  const routeData = useRouteData<{
    incomeBalances: AccountIncomeBalance[];
    normalBalances: AccountNormalBalance[];
  }>("/x/accounting/categories");

  const incomeBalanceOptions =
    routeData?.incomeBalances.map((incomeBalance) => ({
      value: incomeBalance,
      label: incomeBalance,
    })) ?? [];

  const normalBalanceOptions =
    routeData?.normalBalances.map((normalBalance) => ({
      value: normalBalance,
      label: normalBalance,
    })) ?? [];

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
            ? `/x/accounting/categories/${initialValues.id}`
            : "/x/accounting/categories/new"
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
                options={incomeBalanceOptions}
              />
              <Select
                name="normalBalance"
                label="Normal Balance"
                options={normalBalanceOptions}
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
