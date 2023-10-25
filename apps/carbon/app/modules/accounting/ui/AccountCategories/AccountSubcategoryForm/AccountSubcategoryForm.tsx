import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  FormLabel,
  HStack,
  Input as ChakraInput,
  VStack,
} from "@chakra-ui/react";
import { useParams } from "@remix-run/react";
import { ValidatedForm } from "remix-validated-form";
import { Hidden, Input, Submit } from "~/components/Form";
import { usePermissions, useRouteData } from "~/hooks";
import type { AccountCategory } from "~/modules/accounting";
import { accountSubcategoryValidator } from "~/modules/accounting";
import type { TypeOfValidator } from "~/types/validators";
import { path } from "~/utils/path";

type AccountSubcategoryFormProps = {
  initialValues: TypeOfValidator<typeof accountSubcategoryValidator>;
  onClose: () => void;
};

const AccountSubcategoryForm = ({
  initialValues,
  onClose,
}: AccountSubcategoryFormProps) => {
  const params = useParams();
  const permissions = usePermissions();

  const { categoryId } = params;
  if (!categoryId) throw new Error("categoryId is not found");

  const routeData = useRouteData<{
    accountCategory: AccountCategory;
  }>(path.to.accountingCategoryList(categoryId));

  const category = routeData?.accountCategory.category ?? "";

  const isEditing = initialValues.id !== undefined;
  const isDisabled = isEditing
    ? !permissions.can("update", "accounting")
    : !permissions.can("create", "accounting");

  return (
    <Drawer onClose={onClose} isOpen={true} size="sm">
      <ValidatedForm
        validator={accountSubcategoryValidator}
        method="post"
        action={
          isEditing
            ? path.to.accountingSubcategory(initialValues.id!)
            : path.to.newAccountingSubcategory(categoryId)
        }
        defaultValues={initialValues}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {isEditing ? "Edit" : "New"} Account Subcategory
          </DrawerHeader>
          <DrawerBody pb={8}>
            <Hidden name="id" />
            <Hidden name="accountCategoryId" />
            <VStack spacing={2} alignItems="start">
              <FormControl>
                <FormLabel>Category</FormLabel>
                <ChakraInput value={category} isReadOnly />
              </FormControl>
              <Input name="name" label="Name" />
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

export default AccountSubcategoryForm;
