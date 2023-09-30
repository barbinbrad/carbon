import { Box, VStack } from "@chakra-ui/react";
import { ValidatedForm } from "remix-validated-form";
import { Select, Submit } from "~/components/Form";
import { usePermissions } from "~/hooks";
import { fiscalYearSettingsValidator } from "~/modules/accounting";
import { months } from "~/modules/shared";
import type { TypeOfValidator } from "~/types/validators";

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
        action="/x/accounting/years"
        defaultValues={initialValues}
        validator={fiscalYearSettingsValidator}
      >
        <VStack spacing={4} my={4} w="full" alignItems="start" maxW={440}>
          <Select
            name="startMonth"
            label="Start Month"
            options={months.map((month) => ({ label: month, value: month }))}
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
