import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  VStack,
} from "@carbon/react";
import { ValidatedForm } from "@carbon/remix-validated-form";
import { useState } from "react";
import {
  DatePicker,
  Employee,
  Hidden,
  Input,
  Location,
  Shift,
  Submit,
} from "~/components/Form";
import type { EmployeeJob } from "~/modules/resources";
import { employeeJobValidator } from "~/modules/resources";

type PersonJobProps = {
  job: EmployeeJob;
};

const PersonJob = ({ job }: PersonJobProps) => {
  const [location, setLocation] = useState<string | null>(job.locationId);
  return (
    <ValidatedForm
      validator={employeeJobValidator}
      method="post"
      defaultValues={{
        locationId: job.locationId ?? undefined,
        title: job.title ?? undefined,
        startDate: job.startDate ?? undefined,
        managerId: job.managerId ?? undefined,
        shiftId: job.shiftId ?? undefined,
      }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Job</CardTitle>
        </CardHeader>
        <CardContent>
          <VStack spacing={4}>
            <Input name="title" label="Title" />
            <DatePicker name="startDate" label="Start Date" />
            <Location
              name="locationId"
              label="Location"
              onChange={(l) => setLocation(l?.value ?? null)}
            />
            <Shift
              location={location ?? undefined}
              name="shiftId"
              label="Shift"
            />
            <Employee name="managerId" label="Manager" />
            <Hidden name="intent" value="job" />
          </VStack>
        </CardContent>
        <CardFooter>
          <Submit>Save</Submit>
        </CardFooter>
      </Card>
    </ValidatedForm>
  );
};

export default PersonJob;
