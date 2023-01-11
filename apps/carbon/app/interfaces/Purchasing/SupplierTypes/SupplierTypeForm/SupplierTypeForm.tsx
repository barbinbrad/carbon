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
import { supplierTypeValidator } from "~/services/purchasing";

type SupplierTypeFormProps = {
  initialValues: {
    id?: number;
    name: string;
    color: string;
  };
};

const SupplierTypeForm = ({ initialValues }: SupplierTypeFormProps) => {
  const navigate = useNavigate();
  const onClose = () => navigate(-1);

  const isEditing = initialValues.id !== undefined;

  return (
    <Drawer onClose={onClose} isOpen={true} size="sm">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>{isEditing ? "Edit" : "New"} Supplier Type</DrawerHeader>
        <DrawerBody pb={8}>
          <ValidatedForm
            validator={supplierTypeValidator}
            method="post"
            action={
              isEditing
                ? `/app/purchasing/supplier-types/${initialValues.id}`
                : "/app/purchasing/supplier-types/new"
            }
            defaultValues={initialValues}
          >
            <VStack spacing={4} alignItems="start">
              <Hidden name="id" />
              <Input name="name" label="Supplier Type" />
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

export default SupplierTypeForm;
