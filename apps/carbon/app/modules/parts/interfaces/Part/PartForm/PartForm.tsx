import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Grid,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import { ValidatedForm } from "remix-validated-form";
import { Boolean, Input, Select, Submit, TextArea } from "~/components/Form";
import { partValidator } from "~/modules/parts";

type PartFormValues = {
  id?: string;
  name: string;
  description: string;
};

type PartFormProps = {
  initialValues: PartFormValues;
};

const PartForm = ({ initialValues }: PartFormProps) => {
  const isEditing = initialValues.id !== undefined;

  return (
    <ValidatedForm method="post" validator={partValidator}>
      <Card w="full">
        <CardHeader>
          <Heading size="md">{isEditing ? "Part Basics" : "New Part"}</Heading>
          {!isEditing && (
            <Text color="gray.500">
              A part contains the information about a specific item that can be
              purchased or manufactured.
            </Text>
          )}
        </CardHeader>
        <CardBody>
          <Grid
            gridTemplateColumns={
              isEditing ? ["1fr", "1fr", "1fr 1fr 1fr"] : "1fr"
            }
            gridColumnGap={8}
            gridRowGap={2}
            w="full"
          >
            <VStack alignItems="start" spacing={2} w="full">
              <Input name="id" label="Part ID" />
              <Input name="name" label="Name" />
              <TextArea name="description" label="Description" />
            </VStack>
            <VStack alignItems="start" spacing={2} w="full">
              <Select
                name="replenishmentSystem"
                label="Replenishment System"
                options={[{ label: "Purchased", value: "Purchased" }]}
              />
              <Select
                name="partType"
                label="Part Type"
                options={[{ label: "Inventory", value: "Inventory" }]}
              />
              <Select
                name="unitOfMeasureCode"
                label="Unit of Measure"
                options={[{ label: "Each", value: "EA" }]}
              />
            </VStack>
            <VStack alignItems="start" spacing={2} w="full">
              <Select
                name="partGroupId"
                label="Part Group"
                options={[{ label: "Fasteners", value: "1234567901234567900" }]}
              />
              <Boolean name="blocked" label="Blocked" />
            </VStack>
          </Grid>
        </CardBody>
        <CardFooter>
          <Submit>Save</Submit>
        </CardFooter>
      </Card>
    </ValidatedForm>
  );
};

export default PartForm;
