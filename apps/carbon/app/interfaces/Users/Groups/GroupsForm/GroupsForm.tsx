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
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>{isEditing ? "Edit" : "New"} Group</DrawerHeader>
        <DrawerBody pb={8}>
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
            <VStack spacing={4} alignItems="start">
              <Hidden name="id" />
              <Input name="name" label="Group Name" />
              <Users
                name="selections"
                selectionsMaxHeight={"calc(100vh - 330px)"}
                label="Group Members"
              />
              <HStack spacing={2} my={4}>
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
            </VStack>
          </ValidatedForm>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default GroupForm;
