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
import { Boolean, Hidden, Input, Number, Submit } from "~/components/Form";
import { usePermissions, useRouteData } from "~/hooks";
import type { Currency } from "~/modules/accounting";
import { currencyValidator } from "~/modules/accounting";
import type { TypeOfValidator } from "~/types/validators";

type CurrencyFormProps = {
  initialValues: TypeOfValidator<typeof currencyValidator>;
};

const CurrencyForm = ({ initialValues }: CurrencyFormProps) => {
  const permissions = usePermissions();
  const navigate = useNavigate();
  const onClose = () => navigate(-1);

  const routeData = useRouteData<{ baseCurrency: Currency }>("/x/accounting");
  const [name, setName] = useState(initialValues.name);

  const isBaseCurrency = routeData?.baseCurrency.id === initialValues.id;
  const exchnageRateHelperText = isBaseCurrency
    ? "This is the base currency. Exchange rate is always 1."
    : `One ${name} is equal to how many ${routeData?.baseCurrency.name}?`;

  const isEditing = initialValues.id !== undefined;
  const isDisabled = isEditing
    ? !permissions.can("update", "accounting")
    : !permissions.can("create", "accounting");
  return (
    <Drawer onClose={onClose} isOpen={true} size="sm">
      <ValidatedForm
        validator={currencyValidator}
        method="post"
        action={
          isEditing
            ? `/x/accounting/currencies/${initialValues.id}`
            : "/x/accounting/currencies/new"
        }
        defaultValues={initialValues}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>{isEditing ? "Edit" : "New"} Currency</DrawerHeader>
          <DrawerBody pb={8}>
            <Hidden name="id" />
            <VStack spacing={4} alignItems="start">
              <Input
                name="name"
                label="Name"
                onChange={(e) => setName(e.target.value)}
              />
              <Input name="code" label="Code" />
              <Input name="symbol" label="Symbol" />
              <Number
                name="exchangeRate"
                label="Exchange Rate"
                isDisabled={isBaseCurrency}
                min={0}
                helperText={exchnageRateHelperText}
              />
              <Boolean name="isBaseCurrency" label="Base Currency" />
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

export default CurrencyForm;
