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
import { Hidden, Input, Number, Submit } from "~/components/Form";
import { usePermissions } from "~/hooks";
import { sequenceValidator } from "~/modules/settings";
import type { TypeOfValidator } from "~/types/validators";

type SequenceFormProps = {
  initialValues: TypeOfValidator<typeof sequenceValidator>;
};

const SequenceForm = ({ initialValues }: SequenceFormProps) => {
  const permissions = usePermissions();
  const navigate = useNavigate();
  const onClose = () => navigate(-1);

  const isDisabled = !permissions.can("update", "settings");

  return (
    <Drawer onClose={onClose} isOpen={true} size="sm">
      <ValidatedForm
        validator={sequenceValidator}
        method="post"
        action={`/x/settings/sequences/${initialValues.table}`}
        defaultValues={initialValues}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Edit Sequence</DrawerHeader>
          <DrawerBody pb={8}>
            <Hidden name="table" />
            <VStack spacing={4} alignItems="start">
              <Input isReadOnly name="name" label="Name" />
              <Input name="prefix" label="Prefix" />
              <Number name="next" min={0} label="Next" />
              <Number name="size" min={0} max={30} label="Size" />
              <Number name="step" min={0} max={10000} label="Step" />
              <Input name="suffix" label="Suffix" />
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

export default SequenceForm;
