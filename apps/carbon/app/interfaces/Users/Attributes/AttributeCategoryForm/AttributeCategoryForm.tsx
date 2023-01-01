import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { ValidatedForm } from "remix-validated-form";
import { Boolean, Input, Hidden, Submit } from "~/components/Form";
import { attributeCategoryValidator } from "~/services/users";

type AttributeCategoryFormProps = {
  initialValues: {
    id?: number;
    name: string;
    isPublic: boolean;
  };
  onClose: () => void;
};

const AttributeCategoryForm = ({
  initialValues,
  onClose,
}: AttributeCategoryFormProps) => {
  const isEditing = initialValues.id !== undefined;

  return (
    <Drawer onClose={onClose} isOpen={true} size="sm">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>
          {isEditing ? "Edit" : "New"} Attribute Category
        </DrawerHeader>
        <DrawerBody pb={8}>
          <ValidatedForm
            validator={attributeCategoryValidator}
            method="post"
            action={
              isEditing
                ? `/app/users/attributes/${initialValues.id}`
                : "/app/users/attributes/new"
            }
            defaultValues={initialValues}
          >
            <VStack spacing={4} alignItems="start">
              <Hidden name="id" />
              <Input name="name" label="Category Name" />
              <Boolean
                name="isPublic"
                label="Public"
                description="Visible on a user's public profile"
              />
            </VStack>
            <HStack spacing={2} mt={8}>
              <Submit>Save</Submit>
              <Button
                size="md"
                colorScheme="gray"
                variant="solid"
                onClick={onClose}
              >
                Cancel
              </Button>
            </HStack>
          </ValidatedForm>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default AttributeCategoryForm;
