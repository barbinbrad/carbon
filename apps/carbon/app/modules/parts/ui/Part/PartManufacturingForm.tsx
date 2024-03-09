import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  VStack,
} from "@carbon/react";
import { ValidatedForm } from "@carbon/remix-validated-form";
import type { z } from "zod";
import { Boolean, Hidden, Number, Select, Submit } from "~/components/Form";
import { usePermissions } from "~/hooks";
import {
  partManufacturingPolicies,
  partManufacturingValidator,
} from "~/modules/parts";

type PartManufacturingFormProps = {
  initialValues: z.infer<typeof partManufacturingValidator>;
};

const PartManufacturingForm = ({
  initialValues,
}: PartManufacturingFormProps) => {
  const permissions = usePermissions();

  const partManufacturingPolicyOptions =
    partManufacturingPolicies?.map((policy) => ({
      label: policy,
      value: policy,
    })) ?? [];

  return (
    <ValidatedForm
      method="post"
      validator={partManufacturingValidator}
      defaultValues={initialValues}
    >
      <Card>
        <CardHeader>
          <CardTitle>Manufacturing</CardTitle>
        </CardHeader>
        <CardContent>
          <Hidden name="partId" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-2 w-full">
            <VStack>
              <Select
                name="manufacturingPolicy"
                label="Manufacturing Policy"
                options={partManufacturingPolicyOptions}
              />
              {/* <Select
                name="routingId"
                label="Routing ID"
                options={[{ label: "", value: "" }]}
              /> */}
            </VStack>
            <VStack>
              <Number name="manufacturingLeadTime" label="Lead Time (Days)" />
              <Number
                name="scrapPercentage"
                label="Scrap Percentage"
                formatOptions={{ style: "percent" }}
              />
              <Number name="lotSize" label="Lot Size" />
            </VStack>
            <VStack>
              <Boolean
                name="manufacturingBlocked"
                label="Manufacturing Blocked"
              />
              <Boolean
                name="requiresConfiguration"
                label="Requires Configuration"
              />
            </VStack>
          </div>
        </CardContent>
        <CardFooter>
          <Submit isDisabled={!permissions.can("update", "parts")}>Save</Submit>
        </CardFooter>
      </Card>
    </ValidatedForm>
  );
};

export default PartManufacturingForm;
