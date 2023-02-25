import { Card, CardBody, VStack } from "@chakra-ui/react";
import { ValidatedForm } from "remix-validated-form";

import { Input, TimePicker } from "~/components/Form";
import { shiftValidator } from "~/services/resources";

export default function AppIndexRoute() {
  return (
    <Card w={420}>
      <CardBody>
        <ValidatedForm validator={shiftValidator}>
          <VStack w="full" spacing={4} alignItems="start">
            <Input name="name" label="Shift Name" />
            <TimePicker
              name="startTime"
              label="Start Time"
              onChange={(d) => console.log(d.toString())}
            />
            <TimePicker
              name="endTime"
              label="End Time"
              onChange={(d) => console.log(d.toString())}
            />
          </VStack>
        </ValidatedForm>
      </CardBody>
    </Card>
  );
}
