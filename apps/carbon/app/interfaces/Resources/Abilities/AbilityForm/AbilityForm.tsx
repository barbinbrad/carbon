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
import { useState } from "react";
import { ValidatedForm } from "remix-validated-form";
import {
  Employees,
  Hidden,
  Input,
  Number,
  Select,
  Submit,
} from "~/components/Form";
import { usePermissions } from "~/hooks";
import { abilityValidator } from "~/services/resources";

type AbilityFormProps = {
  initialValues: {
    name: string;
    startingPoint: number;
    shadowWeeks: number;
    weeks: number;
    employees: string[];
  };
};

const AbilityForm = ({ initialValues }: AbilityFormProps) => {
  const permissions = usePermissions();
  const navigate = useNavigate();
  const onClose = () => navigate(-1);
  const [maxShadowWeeks, setMaxShadowWeeks] = useState(initialValues.weeks);

  const onWeekChange = (_: string, value: number) => {
    setMaxShadowWeeks(value);
  };

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
                label="Time to Efficiency (Weeks)"
                onChange={onWeekChange}
                min={0}
                max={52}
              />
              <Number
                name="shadowWeeks"
                label="Time Shadowing (Weeks)"
                helperText="Non-productive time spent shadowing another employee"
                min={0}
                max={maxShadowWeeks}
              />
              <Employees
                name="employees"
                selectionsMaxHeight={"calc(100vh - 330px)"}
                label="Employees"
                helperText="Employees who already have this ability"
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

export default AbilityForm;
