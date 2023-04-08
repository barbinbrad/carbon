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
import { Boolean, Hidden, Number, Select, Submit } from "~/components/Form";
import { partManufacturingValidator } from "~/modules/parts";

type PartManufacturingFormValues = {
  partId: string;
};

type PartManufacturingFormProps = {
  initialValues: PartManufacturingFormValues;
};

const PartManufacturingForm = ({
  initialValues,
}: PartManufacturingFormProps) => {
  return (
    <ValidatedForm
      method="post"
      validator={partManufacturingValidator}
      defaultValues={initialValues}
    >
      <Card w="full">
        <CardHeader>
          <Heading size="md">Manufacturing</Heading>
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
              <Select
                name="manufacturingPolicy"
                label="Manufacturing Policy"
                options={[
                  {
                    label: "Make to Stock",
                    value: "Make to Stock",
                  },
                ]}
              />
              <Select
                name="routingId"
                label="Routing ID"
                options={[{ label: "", value: "" }]}
              />
            </VStack>
            <VStack alignItems="start" spacing={2} w="full">
              <Number name="scrapPercentage" label="Scrap Percentage" />
              <Number name="lotSize" label="Lot Size" />
            </VStack>
            <VStack alignItems="start" spacing={2} w="full">
              <Boolean
                name="manufacturingBlocked"
                label="Manufacturing Blocked"
              />
              <Boolean
                name="requiresConfiguration"
                label="Requires Configuration"
              />
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

export default PartManufacturingForm;
