import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Grid,
  Heading,
  VStack,
} from "@chakra-ui/react";
import { ValidatedForm } from "remix-validated-form";
import { CreatableSelect, Hidden, Submit } from "~/components/Form";
import { partInventoryValidator } from "~/modules/parts";

type PartInventoryFormValues = {
  partId: string;
  partBinId: string;
};

type PartInventoryFormProps = {
  initialValues: PartInventoryFormValues;
};

const PartInventoryForm = ({ initialValues }: PartInventoryFormProps) => {
  return (
    <ValidatedForm
      method="post"
      validator={partInventoryValidator}
      defaultValues={initialValues}
    >
      <Card w="full">
        <CardHeader>
          <Heading size="md">Inventory</Heading>
        </CardHeader>
        <CardBody>
          <Hidden name="partId" />
          <Grid
            gridTemplateColumns={["1fr", "1fr", "1fr 1fr 1fr"]}
            gridColumnGap={8}
            gridRowGap={2}
            w="full"
          >
            <VStack alignItems="start" spacing={2} w="full">
              <CreatableSelect
                options={[]}
                name="partBinId"
                label="Part Bin"
                onUsingCreatedChanged={(usingCreated) => {
                  console.log(`usingCreated: ${usingCreated}`);
                }}
                // @ts-ignore
                w="full"
              />
            </VStack>
            <VStack alignItems="start" spacing={2} w="full"></VStack>
            <VStack alignItems="start" spacing={2} w="full"></VStack>
          </Grid>
        </CardBody>
        <CardFooter>
          <Submit>Save</Submit>
        </CardFooter>
      </Card>
    </ValidatedForm>
  );
};

export default PartInventoryForm;
