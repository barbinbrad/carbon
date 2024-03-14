import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  HStack,
  VStack,
} from "@carbon/react";
import { ValidatedForm } from "@carbon/remix-validated-form";
import { z } from "zod";
import { Hidden, Submit } from "~/components/Form";
import { type useCustomFields } from "~/hooks/useCustomFields";

type CustomFormFieldsProps = {
  fields?: ReturnType<typeof useCustomFields>[string];
};

const customFormFieldsValidator = z.array(
  z.object({
    dataTypeId: z.number(),
    id: z.string(),
    listOptions: z.array(z.string()).nullable(),
    name: z.string(),
    sortOrder: z.number(),
  })
);

const CustomFormFields = ({ fields }: CustomFormFieldsProps) => {
  return (
    <ValidatedForm
      method="post"
      validator={customFormFieldsValidator}
      defaultValues={{}}
    >
      <Card>
        <HStack className="w-full justify-between items-start">
          <CardHeader>
            <CardTitle>Custom Fields</CardTitle>
          </CardHeader>
        </HStack>
        <CardContent>
          <Hidden name="partId" />
          <Hidden name="locationId" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-2 w-full">
            <VStack>
              {fields &&
                fields.map((field) => {
                  return (
                    <>
                      <h1>{field.name}</h1>
                    </>
                  );
                })}
            </VStack>
          </div>
        </CardContent>
        <CardFooter>
          <Submit>Save</Submit>
        </CardFooter>
      </Card>
    </ValidatedForm>
  );
};

export default CustomFormFields;
