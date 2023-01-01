import { Box, Grid, VStack } from "@chakra-ui/react";
import { ValidatedForm } from "remix-validated-form";
import { Hidden, Input, Submit, TextArea } from "~/components/Form";
import type { User } from "~/interfaces/Users/types";
import { accountProfileValidator } from "~/services/account";

type ProfileFormProps = {
  user: User;
};

const ProfileForm = ({ user }: ProfileFormProps) => {
  return (
    <Box w="full">
      <ValidatedForm
        method="post"
        action="/app/account/profile"
        validator={accountProfileValidator}
        defaultValues={user}
      >
        <VStack spacing={4} my={4} w="full" alignItems="start">
          <Grid gridTemplateColumns="1fr 1fr" gridColumnGap={4} w="full">
            <Input name="firstName" label="First Name" />
            <Input name="lastName" label="Last Name" />
          </Grid>
          <TextArea name="about" label="About" characterLimit={160} my={2} />
          <Hidden name="intent" value="about" />
          <Submit>Save</Submit>
        </VStack>
      </ValidatedForm>
    </Box>
  );
};

export default ProfileForm;
