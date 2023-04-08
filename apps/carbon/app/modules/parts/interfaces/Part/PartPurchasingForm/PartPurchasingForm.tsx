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
import {
  Boolean,
  Hidden,
  Input,
  Number,
  Select,
  Submit,
  Supplier,
} from "~/components/Form";
import { partPurchasingValidator } from "~/modules/parts";

type PartPurchasingFormValues = {
  partId: string;
};

type PartPurchasingFormProps = {
  initialValues: PartPurchasingFormValues;
};

const PartPurchasingForm = ({ initialValues }: PartPurchasingFormProps) => {
  return (
    <ValidatedForm
      method="post"
      validator={partPurchasingValidator}
      defaultValues={initialValues}
    >
      <Card w="full">
        <CardHeader>
          <Heading size="md">Purchasing</Heading>
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
              <Supplier name="supplierId" label="Supplier" />
              <Input name="supplierPartNumber" label="Supplier Part Number" />
            </VStack>
            <VStack alignItems="start" spacing={2} w="full">
              <Number name="leadTime" label="Lead Time" />
              <Select
                name="purchasingUnitOfMeasureCode"
                label="Purchasing Unit of Measure"
                options={[{ label: "Each", value: "EA" }]}
              />
            </VStack>
            <VStack alignItems="start" spacing={2} w="full">
              <Boolean name="purchasingBlocked" label="Purchasing Blocked" />
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

export default PartPurchasingForm;
