import { Box, VStack } from "@chakra-ui/react";
import { ValidatedForm } from "remix-validated-form";
import { Select, Submit } from "~/components/Form";
import { usePermissions } from "~/hooks";
import { fiscalYearSettingsValidator } from "~/modules/accounting";
import { months } from "~/modules/shared";
import type { TypeOfValidator } from "~/types/validators";
import { path } from "~/utils/path";

type FiscalYearSettingsFormProps = {
  initialValues: TypeOfValidator<typeof fiscalYearSettingsValidator>;
};

const FiscalYearSettingsForm = ({
  initialValues,
}: FiscalYearSettingsFormProps) => {
  const permissions = usePermissions();
  return (
    <Box w="full">
      <ValidatedForm
        method="post"
        action={path.to.fiscalYears}
        defaultValues={initialValues}
        validator={fiscalYearSettingsValidator}
      >
        <VStack spacing={4} my={4} w="full" alignItems="start" maxW={440}>
          <Select
            name="startMonth"
            label="Start of Fiscal Year"
            options={months.map((month) => ({ label: month, value: month }))}
            helperText="This is the month your fiscal year starts."
          />
          <Select
            name="taxStartMonth"
            label="Start of Tax Year"
            options={months.map((month) => ({ label: month, value: month }))}
            helperText="This is the month your tax year starts."
          />
          <Submit
            isDisabled={
              !permissions.can("update", "accounting") ||
              !permissions.is("employee")
            }
          >
            Save
          </Submit>
        </VStack>
      </ValidatedForm>
    </Box>
  );
};

export default FiscalYearSettingsForm;
