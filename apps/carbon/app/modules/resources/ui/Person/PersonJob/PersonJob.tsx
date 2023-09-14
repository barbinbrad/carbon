import { Select } from "@carbon/react";
import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  VStack,
} from "@chakra-ui/react";
import { useFetcher } from "@remix-run/react";
import { useEffect, useMemo } from "react";
import { useControlField, useField, ValidatedForm } from "remix-validated-form";
import {
  DatePicker,
  Employee,
  Hidden,
  Input,
  Location,
  Submit,
} from "~/components/Form";
import { SectionTitle } from "~/components/Layout";
import type { EmployeeJob, getShiftsList } from "~/modules/resources";
import { employeeJobValidator } from "~/modules/resources";
import { mapRowsToOptions } from "~/utils/form";

type PersonJobProps = {
  job: EmployeeJob;
};

const PersonJob = ({ job }: PersonJobProps) => {
  const shiftFetcher = useFetcher<Awaited<ReturnType<typeof getShiftsList>>>();

  const onLocationChange = ({ value }: { value: string | number }) => {
    if (value) shiftFetcher.load(`/api/resources/shifts?location=${value}`);
  };

  useEffect(() => {
    if (job.locationId)
      shiftFetcher.load(`/api/resources/shifts?location=${job.locationId}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const shifts = useMemo(
    () =>
      mapRowsToOptions({
        data: shiftFetcher.data?.data ?? [],
        value: "id",
        label: "name",
      }),
    [shiftFetcher.data]
  );

  return (
    <Box w="full">
      <ValidatedForm
        validator={employeeJobValidator}
        method="post"
        defaultValues={{
          locationId: job.locationId ?? undefined,
          title: job.title ?? undefined,
          managerId: job.managerId ?? undefined,
          shiftId: job.shiftId ?? undefined,
        }}
      >
        <SectionTitle title="Job" />
        <VStack w="full" alignItems="start" spacing={4}>
          <Input name="title" label="Title" />
          <DatePicker name="startDate" label="Start Date" />
          <Location
            name="locationId"
            label="Location"
            onChange={onLocationChange}
          />
          <ShiftByLocation
            shifts={shifts}
            initialShift={job.shiftId ?? undefined}
          />
          <Employee name="managerId" label="Manager" />
          <Hidden name="intent" value="job" />
          <Submit size="sm">Save</Submit>
        </VStack>
      </ValidatedForm>
    </Box>
  );
};

const SHIFT_FIELD = "shiftId";

const ShiftByLocation = ({
  shifts,
  initialShift,
}: {
  shifts: { value: string | number; label: string }[];
  initialShift?: string;
}) => {
  const { error, getInputProps } = useField(SHIFT_FIELD);

  const [shift, setShift] = useControlField<{
    value: string | number;
    label: string;
  } | null>(SHIFT_FIELD);

  useEffect(() => {
    // if the initial value is in the options, set it, otherwise set to null
    if (shifts) {
      setShift(shifts.find((s) => s.value === initialShift) ?? null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shifts, initialShift]);

  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={SHIFT_FIELD}>Shift</FormLabel>
      <Select
        {...getInputProps({
          // @ts-ignore
          id: SHIFT_FIELD,
        })}
        options={shifts}
        value={shift}
        onChange={setShift}
        // @ts-ignore
        w="full"
      />
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};

export default PersonJob;
