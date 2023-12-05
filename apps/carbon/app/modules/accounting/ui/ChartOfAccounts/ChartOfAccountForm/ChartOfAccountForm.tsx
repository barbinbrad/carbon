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
  AccountClass,
  AccountIncomeBalance,
} from "~/modules/accounting";
import {
  accountClassTypes,
  accountTypes,
  accountValidator,
  consolidatedRateTypes,
  incomeBalanceTypes,
} from "~/modules/accounting";
import type { TypeOfValidator } from "~/types/validators";
import { path } from "~/utils/path";

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
  const [incomeBalance, setIncomeBalance] = useState<AccountIncomeBalance>(
    initialValues.incomeBalance
  );
  const [accountClass, setAccountClass] = useState<AccountClass>(
    initialValues.class
  );

  const isEditing = initialValues.id !== undefined;
  const isDisabled = isEditing
    ? !permissions.can("update", "accounting")
    : !permissions.can("create", "accounting");

  const onAccountCategoryChange = (category?: AccountCategoryType) => {
    if (category) {
      setAccountCategoryId(category.id ?? "");
      setIncomeBalance(category.incomeBalance ?? "Income Statement");
      setAccountClass(category.class ?? "Asset");
    }
  };

  return (
    <Drawer onClose={onClose} isOpen={true} size="full">
      <ValidatedForm
        validator={accountValidator}
        method="post"
        action={
          isEditing
            ? path.to.chartOfAccount(initialValues.id!)
            : path.to.newChartOfAccount
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
                  name="class"
                  label="Class"
                  options={accountClassTypes.map((accountClass) => ({
                    label: accountClass,
                    value: accountClass,
                  }))}
                  value={accountClass}
                  onChange={(newValue) => {
                    if (newValue) setAccountClass(newValue as AccountClass);
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
