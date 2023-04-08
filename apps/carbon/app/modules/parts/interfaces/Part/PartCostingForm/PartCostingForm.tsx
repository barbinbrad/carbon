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
import { partCostValidator } from "~/modules/parts";

type PartCostingFormValues = {
  partId: string;
};

type PartCostingFormProps = {
  initialValues: PartCostingFormValues;
};

const PartCostingForm = ({ initialValues }: PartCostingFormProps) => {
  return (
    <ValidatedForm
      method="post"
      validator={partCostValidator}
      defaultValues={initialValues}
    >
      <Card w="full">
        <CardHeader>
          <Heading size="md">Costing & Posting</Heading>
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
                name="costingMethod"
                label="Part Costing Method"
                options={[{ label: "Standard", value: "Standard" }]}
              />
              <Number name="standardCost" label="Standard Cost" />
              <Number name="unitCost" label="Unit Cost" />
            </VStack>
            <VStack alignItems="start" spacing={2} w="full">
              <Select
                name="salesAccountId"
                label="Sales Account"
                options={[{ label: "", value: "" }]}
              />
              <Select
                name="inventoryAccountId"
                label="Inventory Account"
                options={[{ label: "", value: "" }]}
              />
              <Select
                name="discountAccountId"
                label="Discount Account"
                options={[{ label: "", value: "" }]}
              />
            </VStack>
            <VStack alignItems="start" spacing={2} w="full">
              <Number name="salesHistory" label="Sales History" />
              <Number name="salesHistoryQty" label="Sales History Qty" />
              <Boolean name="costIsAdjusted" label="Cost Is Adjusted" />
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

export default PartCostingForm;
