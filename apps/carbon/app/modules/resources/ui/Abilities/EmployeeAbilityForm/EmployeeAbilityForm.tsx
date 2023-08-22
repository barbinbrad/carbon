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
import { useParams } from "@remix-run/react";
import { useState } from "react";
import { ValidatedForm } from "remix-validated-form";
import { Employee, Hidden, Select, Slider, Submit } from "~/components/Form";
import { usePermissions } from "~/hooks";
import type { Ability } from "~/modules/resources";
import { AbilityEmployeeStatus } from "~/modules/resources";
import { employeeAbilityValidator } from "~/modules/resources";
import type { TypeOfValidator } from "~/types/validators";

type EmployeeAbilityFormProps = {
  ability?: Ability;
  initialValues: TypeOfValidator<typeof employeeAbilityValidator>;
  weeks: number;
  onClose: () => void;
};

const defaultPercent = 50;

const EmployeeAbilityForm = ({
  ability,
  initialValues,
  weeks,
  onClose,
}: EmployeeAbilityFormProps) => {
  const { id } = useParams();
  const permissions = usePermissions();
  const isEditing = initialValues.employeeId !== undefined;
  const isDisabled = isEditing
    ? !permissions.can("update", "resources")
    : !permissions.can("create", "resources");

  const days = (percent: number) => weeks * 5 * (percent / 100);
  const [trainingDays, setTrainingDays] = useState(
    days(initialValues.trainingPercent ?? defaultPercent)
  );
  const updateTrainingDays = (percent: number) => {
    setTrainingDays(days(percent));
  };

  const [inProgress, setInProgress] = useState(
    initialValues?.trainingStatus === AbilityEmployeeStatus.InProgress
  );

  if (!ability) return null;

  return (
    <Drawer onClose={onClose} isOpen={true} size="sm">
      <ValidatedForm
        validator={employeeAbilityValidator}
        method="post"
        action={
          isEditing
            ? `/x/resources/ability/${ability.id}/employee/${id}`
            : `/x/resources/ability/${ability.id}/employee/new`
        }
        defaultValues={initialValues}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>{isEditing ? "Edit" : "New"} Employee</DrawerHeader>
          <DrawerBody pb={8}>
            <VStack spacing={4} alignItems="start">
              <Employee
                name="employeeId"
                label="Employee"
                readOnly={isEditing}
              />
              <Select
                name="trainingStatus"
                label="Training Status"
                onChange={({ value }) => {
                  setInProgress(value === AbilityEmployeeStatus.InProgress);
                }}
                options={[
                  {
                    value: AbilityEmployeeStatus.NotStarted,
                    label: "Not Started",
                  },
                  {
                    value: AbilityEmployeeStatus.InProgress,
                    label: "In Progress",
                  },
                  {
                    value: AbilityEmployeeStatus.Complete,
                    label: "Complete",
                  },
                ]}
              />
              {inProgress && (
                <>
                  <Slider
                    name="trainingPercent"
                    label="Training Percent"
                    onChange={(value) => updateTrainingDays(value)}
                    defaultValue={defaultPercent}
                    min={0}
                    max={100}
                    step={10}
                  />
                  <Hidden name="trainingDays" value={trainingDays} />
                </>
              )}
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

export default EmployeeAbilityForm;
