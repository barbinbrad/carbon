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
import { Color, Hidden, Input, Submit } from "~/components/Form";
import { customerTypeValidator } from "~/services/sales";

type CustomerTypeFormProps = {
  initialValues: {
    id?: string;
    name: string;
    color: string;
  };
};

const CustomerTypeForm = ({ initialValues }: CustomerTypeFormProps) => {
  const navigate = useNavigate();
  const onClose = () => navigate(-1);

  const isEditing = initialValues.id !== undefined;

  return (
    <Drawer onClose={onClose} isOpen={true} size="sm">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>{isEditing ? "Edit" : "New"} Customer Type</DrawerHeader>
        <DrawerBody pb={8}>
          <ValidatedForm
            validator={customerTypeValidator}
            method="post"
            action={
              isEditing
                ? `/app/sales/customer-types/${initialValues.id}`
                : "/app/sales/customer-types/new"
            }
            defaultValues={initialValues}
          >
            <VStack spacing={4} alignItems="start">
              <Hidden name="id" />
              <Input name="name" label="Customer Type" />
              <Color name="color" label="Color" />
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
            </VStack>
          </ValidatedForm>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default CustomerTypeForm;
