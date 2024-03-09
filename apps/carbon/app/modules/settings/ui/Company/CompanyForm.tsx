import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  VStack,
} from "@carbon/react";
import { ValidatedForm } from "@carbon/remix-validated-form";
import type { z } from "zod";
import { Hidden, Input, Submit } from "~/components/Form";
import { companyValidator } from "~/modules/settings";
import { path } from "~/utils/path";

type CompanyFormProps = {
  company: z.infer<typeof companyValidator>;
};

const CompanyForm = ({ company }: CompanyFormProps) => {
  return (
    <Card>
      <ValidatedForm
        method="post"
        action={path.to.company}
        validator={companyValidator}
        defaultValues={company}
      >
        <CardHeader>
          <CardTitle>Company</CardTitle>
          <CardDescription>
            This information will be displayed on document headers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VStack spacing={4} className="my-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <Input name="name" label="Company Name" />
              <Input name="taxId" label="Tax ID" />
              <Input name="addressLine1" label="Address Line 1" />
              <Input name="addressLine2" label="Address Line 2" />
              <Input name="city" label="City" />
              <Input name="state" label="State" />
              <Input name="postalCode" label="Postal Code" />
              <Input name="countryCode" label="Country" />
              <Input name="phone" label="Phone Number" />
              <Input name="fax" label="Fax Number" />
              <Input name="email" label="Email" />
              <Input name="website" label="Website" />
            </div>
            <Hidden name="intent" value="about" />
          </VStack>
        </CardContent>
        <CardFooter>
          <Submit>Save</Submit>
        </CardFooter>
      </ValidatedForm>
    </Card>
  );
};

export default CompanyForm;
