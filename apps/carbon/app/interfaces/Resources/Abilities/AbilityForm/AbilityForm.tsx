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
import { Hidden, Input, Number, Select, Submit } from "~/components/Form";
import { usePermissions } from "~/hooks";
import { abilityValidator } from "~/services/resources";

type AbilityFormProps = {
  initialValues: {
    name: string;
    startingPoint: number;
    weeks: number;
  };
};

const AbilityForm = ({ initialValues }: AbilityFormProps) => {
  const permissions = usePermissions();
  const navigate = useNavigate();
  const onClose = () => navigate(-1);

  const isDisabled = !permissions.can("create", "resources");

  return (
    <Drawer onClose={onClose} isOpen={true} size="sm">
      <ValidatedForm
        validator={abilityValidator}
        method="post"
        action={"/x/resources/abilities/new"}
        defaultValues={initialValues}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>New Ability</DrawerHeader>
          <DrawerBody pb={8}>
            <Hidden name="id" />
            <VStack spacing={4} alignItems="start">
              <Input name="name" label="Name" />
              <Select
                name="startingPoint"
                label="Learning Curve"
                options={[
                  { value: 85, label: "Easy" },
                  { value: 70, label: "Medium" },
                  { value: 50, label: "Hard" },
                ]}
              />
              <Number
                name="weeks"
                label="Weeks to Efficiency"
                min={0}
                max={52}
              />
              {/* <Employees
                name="selections"
                selectionsMaxHeight={"calc(100vh - 330px)"}
                label="Employees"
              /> */}
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

export default AbilityForm;
