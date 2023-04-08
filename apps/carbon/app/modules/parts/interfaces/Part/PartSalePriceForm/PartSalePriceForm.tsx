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
import { Hidden, Submit } from "~/components/Form";
import { partUnitSalePriceValidator } from "~/modules/parts";

type PartSalePriceFormValues = {
  partId: string;
};

type PartSalePriceFormProps = {
  initialValues: PartSalePriceFormValues;
};

const PartSalePriceForm = ({ initialValues }: PartSalePriceFormProps) => {
  return (
    <ValidatedForm
      method="post"
      validator={partUnitSalePriceValidator}
      defaultValues={initialValues}
    >
      <Card w="full">
        <CardHeader>
          <Heading size="md">Sale Price</Heading>
        </CardHeader>
        <CardBody>
          <Hidden name="partId" />
          <Grid
            gridTemplateColumns={["1fr", "1fr", "1fr 1fr 1fr"]}
            gridColumnGap={8}
            gridRowGap={2}
            w="full"
          >
            <VStack alignItems="start" spacing={2} w="full"></VStack>
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

export default PartSalePriceForm;
