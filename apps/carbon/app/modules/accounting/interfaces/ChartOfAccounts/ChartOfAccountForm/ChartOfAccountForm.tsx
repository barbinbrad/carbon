import { useColor } from "@carbon/react";
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
  Heading,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "@remix-run/react";

import { ValidatedForm } from "remix-validated-form";
import {
  AccountCategory,
  Hidden,
  Input,
  Select,
  Submit,
} from "~/components/Form";
import { usePermissions } from "~/hooks";
import type { AccountCategory as AccountCategoryType } from "~/modules/accounting";
import {
  accountTypes,
  accountValidator,
  incomeBalanceType,
  normalBalanceType,
} from "~/modules/accounting";
import type { TypeOfValidator } from "~/types/validators";

type ChartOfAccountFormProps = {
  initialValues: TypeOfValidator<typeof accountValidator>;
};

const ChartOfAccountForm = ({ initialValues }: ChartOfAccountFormProps) => {
  const permissions = usePermissions();
  const navigate = useNavigate();
  const onClose = () => navigate(-1);
  const borderColor = useColor("gray.200");

  const isEditing = initialValues.id !== undefined;
  const isDisabled = isEditing
    ? !permissions.can("update", "accounting")
    : !permissions.can("create", "accounting");

  const accountTypeOptions = accountTypes.map((accountType) => ({
    label: accountType,
    value: accountType,
  }));

  const normalBalanceOptions = normalBalanceType.map((normalBalance) => ({
    label: normalBalance,
    value: normalBalance,
  }));

  const incomeBalanceOptions = incomeBalanceType.map((incomeBalance) => ({
    label: incomeBalance,
    value: incomeBalance,
  }));

  const onAccountCategoryChange = (category?: AccountCategoryType) => {
    console.log(category);
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
          <DrawerHeader>{isEditing ? "Edit" : "New"} Account</DrawerHeader>
          <DrawerBody pb={8}>
            <Hidden name="id" />
            {isEditing && (
              <Heading
                size="2xl"
                pb={6}
                mb={6}
                borderBottom="1px solid"
                borderColor={borderColor}
                noOfLines={1}
              >
                {`${initialValues.number} - ${initialValues.name}`}
              </Heading>
            )}

            <Grid
              gridTemplateColumns={["1fr", "1fr", "1fr 1fr 1fr"]}
              gridColumnGap={8}
              gridRowGap={2}
              w="full"
            >
              <VStack spacing={4} alignItems="start">
                <Input name="number" label="Number" />
                <Input name="name" label="Name" />
                <Select name="type" label="Type" options={accountTypeOptions} />
              </VStack>
              <VStack spacing={4} alignItems="start">
                <AccountCategory
                  name="accountCategoryId"
                  onChange={onAccountCategoryChange}
                />
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