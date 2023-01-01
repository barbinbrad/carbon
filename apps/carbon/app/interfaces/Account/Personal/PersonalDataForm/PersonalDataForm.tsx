import { Box, Grid, VStack } from "@chakra-ui/react";
import { ValidatedForm } from "remix-validated-form";
import { Submit } from "~/components/Form";
import type { PersonalData } from "~/interfaces/Account/types";
import { accountPersonalDataValidator } from "~/services/account";

type PersonalDataFormProps = {
  personalData: PersonalData;
};

const PersonalDataForm = ({ personalData }: PersonalDataFormProps) => {
  return (
    <Box w="full">
      <ValidatedForm
        method="post"
        action="/app/account/personal"
        validator={accountPersonalDataValidator}
        defaultValues={personalData}
      >
        <VStack alignItems="start" w="full" spacing={4} mt={4}>
          <Grid gridTemplateColumns="1fr 1fr" gridColumnGap={4} w="full"></Grid>

          <Submit>Save</Submit>
        </VStack>
      </ValidatedForm>
    </Box>
  );
};

export default PersonalDataForm;
