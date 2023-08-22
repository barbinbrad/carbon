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
import { Hidden, Input, Submit, TextArea, Users } from "~/components/Form";
import { usePermissions } from "~/hooks";
import { documentValidator } from "~/modules/documents";
import type { TypeOfValidator } from "~/types/validators";

type DocumentFormProps = {
  initialValues: TypeOfValidator<typeof documentValidator>;
  ownerId: string;
};

const DocumentForm = ({ initialValues, ownerId }: DocumentFormProps) => {
  const permissions = usePermissions();
  const navigate = useNavigate();
  const onClose = () => navigate(-1);

  const isDisabled = !permissions.can("update", "documents");

  return (
    <Drawer onClose={onClose} isOpen={true} size="sm">
      <ValidatedForm
        validator={documentValidator}
        method="post"
        action={`/x/documents/search/${initialValues.id}`}
        defaultValues={initialValues}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>{`Edit ${initialValues.name}.${initialValues.type}`}</DrawerHeader>
          <DrawerBody pb={8}>
            <Hidden name="id" />
            <Hidden name="type" />
            <Hidden name="size" />
            <VStack spacing={4} alignItems="start">
              <Input
                name="name"
                label="Name"
                suffix={`.${initialValues.type}`}
              />
              <TextArea name="description" label="Description" />
              <Users
                alwaysSelected={[ownerId]}
                name="readGroups"
                label="View Permissions"
              />
              <Users
                alwaysSelected={[ownerId]}
                name="writeGroups"
                label="Edit Permissions"
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

export default DocumentForm;
