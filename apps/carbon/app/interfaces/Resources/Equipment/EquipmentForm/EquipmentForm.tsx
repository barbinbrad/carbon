import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  // FormControl,
  // FormErrorMessage,
  // FormLabel,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";
import { ValidatedForm } from "remix-validated-form";
import {
  Input,
  Hidden,
  Location,
  Number,
  Submit,
  Select,
  TextArea,
} from "~/components/Form";
import { usePermissions } from "~/hooks";
import type { getWorkCellList } from "~/services/resources";
import { equipmentValidator } from "~/services/resources";
import type { TypeOfValidator } from "~/types/validators";
import { mapRowsToOptions } from "~/utils/form";

type EquipmentFormProps = {
  initialValues: TypeOfValidator<typeof equipmentValidator>;
  equipmentTypes: {
    id: string;
    name: string;
  }[];
  onClose: () => void;
};

const EquipmentForm = ({
  initialValues,
  equipmentTypes,
  onClose,
}: EquipmentFormProps) => {
  const permissions = usePermissions();
  const options = mapRowsToOptions({
    data: equipmentTypes,
    value: "id",
    label: "name",
  });
  const isEditing = initialValues.id !== undefined;
  const isDisabled = isEditing
    ? !permissions.can("update", "resources")
    : !permissions.can("create", "resources");

  const workCellFetcher =
    useFetcher<Awaited<ReturnType<typeof getWorkCellList>>>();
  const [location, setLocation] = useState<string | null>(
    initialValues.locationId ?? null
  );

  const onLocationChange = ({ value }: { value: string | number }) => {
    setLocation(value as string);
  };

  useEffect(() => {
    workCellFetcher.load(`/api/resources/work-cells?location=${location}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  // const workCells = useMemo(
  //   () =>
  //     mapRowsToOptions({
  //       data: workCellFetcher.data?.data ?? [],
  //       value: "id",
  //       label: "name",
  //     }),
  //   [workCellFetcher.data]
  // );

  return (
    <Drawer onClose={onClose} isOpen={true} size="sm">
      <ValidatedForm
        validator={equipmentValidator}
        method="post"
        action={
          isEditing
            ? `/x/resources/equipment/unit/${initialValues.id}`
            : "/x/resources/equipment/unit/new"
        }
        defaultValues={initialValues}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>{isEditing ? "Edit" : "New"} Equipment</DrawerHeader>
          <DrawerBody pb={8}>
            <Hidden name="id" />
            <VStack spacing={2} alignItems="start">
              <Input name="name" label="Name" />
              <TextArea name="description" label="Description" />
              <Select
                name="equipmentTypeId"
                label="Equipment Type"
                options={options}
              />
              <Location
                name="locationId"
                label="Location"
                onChange={onLocationChange}
              />
              {/* <WorkCellsByLocation
                workCells={workCells}
                initialWorkCell={initialValues.workCellId ?? undefined}
              /> */}
              <Number
                name="setupHours"
                label="Setup Hours"
                min={0}
                max={100} // this seems like a reasonable max?
              />
              <Number
                name="operatorsRequired"
                label="Operators Required"
                min={0}
                max={100} // this seems like a reasonable max?
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

/*
const WORK_CELL_FIELD = "workCellId";

const WorkCellsByLocation = ({
  workCells,
  initialWorkCell,
}: {
  workCells: { value: string | number; label: string }[];
  initialWorkCell?: string;
}) => {
  const { error, getInputProps } = useField(WORK_CELL_FIELD);

  const [workCell, setWorkCell] = useControlField<{
    value: string | number;
    label: string;
  } | null>(WORK_CELL_FIELD);

  useEffect(() => {
    // if the initial value is in the options, set it, otherwise set to null
    if (workCells) {
      setWorkCell(workCells.find((s) => s.value === initialWorkCell) ?? null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workCells, initialWorkCell]);

  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={WORK_CELL_FIELD}>Work Cell</FormLabel>
      <Select
        {...getInputProps({
          // @ts-ignore
          id: WORK_CELL_FIELD,
        })}
        options={workCells}
        value={workCell}
        onChange={setWorkCell}
        // @ts-ignore
        w="full"
      />
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};
*/
export default EquipmentForm;
