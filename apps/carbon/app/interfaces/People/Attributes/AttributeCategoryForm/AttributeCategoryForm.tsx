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
import { Boolean, Input, Hidden, Submit } from "~/components/Form";
import { usePermissions } from "~/hooks";
import { attributeCategoryValidator } from "~/services/people";

type AttributeCategoryFormProps = {
  initialValues: {
    id?: string;
    name: string;
    isPublic: boolean;
  };
  onClose: () => void;
};

const AttributeCategoryForm = ({
  initialValues,
  onClose,
}: AttributeCategoryFormProps) => {
  const permissions = usePermissions();
  const isEditing = initialValues.id !== undefined;
  const isDisabled = isEditing
    ? !permissions.can("update", "users")
    : !permissions.can("create", "users");

  return (
    <Drawer onClose={onClose} isOpen={true} size="sm">
      <ValidatedForm
        validator={attributeCategoryValidator}
        method="post"
        action={
          isEditing
            ? `/x/people/attributes/${initialValues.id}`
            : "/x/people/attributes/new"
        }
        defaultValues={initialValues}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {isEditing ? "Edit" : "New"} Attribute Category
          </DrawerHeader>
          <DrawerBody pb={8}>
            <Hidden name="id" />
            <VStack spacing={4} alignItems="start">
              <Input name="name" label="Category Name" />
              <Boolean
                name="isPublic"
                label="Public"
                description="Visible on a user's public profile"
              />
            </VStack>
          </DrawerBody>
          <DrawerFooter>
            <HStack spacing={2} mt={8}>
              <Submit disabled={isDisabled}>Save</Submit>
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

export default AttributeCategoryForm;
