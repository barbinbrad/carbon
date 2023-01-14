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
import { Hidden, Input, Submit, Users } from "~/components/Form";
import { groupValidator } from "~/services/users";

type GroupFormProps = {
  initialValues: {
    id?: string;
    name: string;
    selections: string[];
  };
};

const GroupForm = ({ initialValues }: GroupFormProps) => {
  const navigate = useNavigate();
  const onClose = () => navigate(-1);

  const isEditing = initialValues.id !== undefined;

  return (
    <Drawer onClose={onClose} isOpen={true} size="sm">
      <ValidatedForm
        validator={groupValidator}
        method="post"
        action={
          isEditing
            ? `/app/users/groups/${initialValues.id}`
            : "/app/users/groups/new"
        }
        defaultValues={initialValues}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>{isEditing ? "Edit" : "New"} Group</DrawerHeader>
          <DrawerBody pb={8}>
            <VStack spacing={4} alignItems="start">
              <Hidden name="id" />
              <Input name="name" label="Group Name" />
              <Users
                name="selections"
                selectionsMaxHeight={"calc(100vh - 330px)"}
                label="Group Members"
              />
            </VStack>
          </DrawerBody>
          <DrawerFooter>
            <HStack spacing={2}>
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
          </DrawerFooter>
        </DrawerContent>
      </ValidatedForm>
    </Drawer>
  );
};

export default GroupForm;
