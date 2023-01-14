import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Grid,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "@remix-run/react";
import { ValidatedForm } from "remix-validated-form";
import { Input, Submit, TextArea } from "~/components/Form";
import { supplierValidator } from "~/services/purchasing";

type SupplierFormProps = {
  initialValues: {
    id?: string;
    name: string;
  };
};

const SupplierForm = ({ initialValues }: SupplierFormProps) => {
  const navigate = useNavigate();
  const onClose = () => navigate(-1);

  const isEditing = initialValues.id !== undefined;

  return (
    <Drawer onClose={onClose} isOpen size="full">
      <ValidatedForm
        method="post"
        action={
          isEditing
            ? `/app/purchasing/customers/${initialValues.id}`
            : "/app/purchasing/customers/new"
        }
        validator={supplierValidator}
        defaultValues={initialValues}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>New Supplier</DrawerHeader>
          <DrawerBody>
            <Grid
              gridTemplateColumns={["3fr 1fr", "1fr", "1fr"]}
              gridColumnGap={4}
              w="full"
            >
              <Box w="full">
                <VStack spacing={4} my={4} w="full" alignItems="start">
                  <Input name="name" label="Name" />
                  <TextArea
                    name="description"
                    label="Description"
                    characterLimit={160}
                    my={2}
                  />
                </VStack>
              </Box>
            </Grid>
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

export default SupplierForm;
