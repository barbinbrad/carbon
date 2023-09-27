import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Grid,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "@remix-run/react";
import { useState } from "react";

import { ValidatedForm } from "remix-validated-form";
import {
  AccountCategory,
  AccountSubcategory,
  Boolean,
  Hidden,
  Input,
  Select,
  SelectControlled,
  Submit,
} from "~/components/Form";
import { usePermissions } from "~/hooks";
import type {
  AccountCategory as AccountCategoryType,
  AccountIncomeBalance,
  AccountNormalBalance,
} from "~/modules/accounting";
import {
  accountTypes,
  accountValidator,
  consolidatedRateTypes,
  incomeBalanceTypes,
  normalBalanceTypes,
} from "~/modules/accounting";
import type { TypeOfValidator } from "~/types/validators";

type ChartOfAccountFormProps = {
  initialValues: TypeOfValidator<typeof accountValidator>;
};

const ChartOfAccountForm = ({ initialValues }: ChartOfAccountFormProps) => {
  const permissions = usePermissions();
  const navigate = useNavigate();
  const onClose = () => navigate(-1);

  const [accountCategoryId, setAccountCategoryId] = useState<string>(
    initialValues.accountCategoryId ?? ""
  );
  const [incomeBalance, setIncomeBalance] = useState<
    "Balance Sheet" | "Income Statement"
  >(initialValues.incomeBalance);
  const [normalBalance, setNormalBalance] = useState<
    "Debit" | "Credit" | "Both"
  >(initialValues.normalBalance);

  const isEditing = initialValues.id !== undefined;
  const isDisabled = isEditing
    ? !permissions.can("update", "accounting")
    : !permissions.can("create", "accounting");

  const onAccountCategoryChange = (category?: AccountCategoryType) => {
    if (category) {
      setAccountCategoryId(category.id ?? "");
      setIncomeBalance(category.incomeBalance ?? "Income Statement");
      setNormalBalance(category.normalBalance ?? "Debit");
    }
  };

  return (
    <Drawer onClose={onClose} isOpen={true} size="full">
      <ValidatedForm
        validator={accountValidator}
        method="post"
        action={
          isEditing
            ? `/x/accounting/charts/${initialValues.id}`
            : "/x/accounting/charts/new"
        }
        defaultValues={initialValues}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {isEditing
              ? `${initialValues.number} - ${initialValues.name}`
              : "New Account"}
          </DrawerHeader>
          <DrawerBody pb={8}>
            <Hidden name="id" />

            <Grid
              gridTemplateColumns={["1fr", "1fr", "1fr 1fr 1fr"]}
              gridColumnGap={8}
              gridRowGap={2}
              w="full"
            >
              <VStack spacing={4} alignItems="start">
                <Input name="number" label="Account Number" />
                <Input name="name" label="Name" />
                <Select
                  name="type"
                  label="Type"
                  options={accountTypes.map((accountType) => ({
                    label: accountType,
                    value: accountType,
                  }))}
                />
              </VStack>
              <VStack spacing={4} alignItems="start">
                <AccountCategory
                  name="accountCategoryId"
                  onChange={onAccountCategoryChange}
                />
                <AccountSubcategory
                  name="accountSubcategoryId"
                  accountCategoryId={accountCategoryId}
                />
                <SelectControlled
                  name="incomeBalance"
                  label="Income/Balance"
                  options={incomeBalanceTypes.map((incomeBalance) => ({
                    label: incomeBalance,
                    value: incomeBalance,
                  }))}
                  value={incomeBalance}
                  onChange={(newValue) => {
                    if (newValue)
                      setIncomeBalance(newValue as AccountIncomeBalance);
                  }}
                />
              </VStack>
              <VStack spacing={4} alignItems="start">
                <SelectControlled
                  name="normalBalance"
                  label="Normal Balance"
                  options={normalBalanceTypes.map((normalBalance) => ({
                    label: normalBalance,
                    value: normalBalance,
                  }))}
                  value={normalBalance}
                  onChange={(newValue) => {
                    if (newValue)
                      setNormalBalance(newValue as AccountNormalBalance);
                  }}
                />
                <Select
                  name="consolidatedRate"
                  label="Consolidated Rate"
                  options={consolidatedRateTypes.map(
                    (consolidatedRateType) => ({
                      label: consolidatedRateType,
                      value: consolidatedRateType,
                    })
                  )}
                />
                <Boolean name="directPosting" label="Direct Posting" />
              </VStack>
            </Grid>
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

export default ChartOfAccountForm;
