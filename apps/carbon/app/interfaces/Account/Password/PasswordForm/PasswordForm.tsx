import { Box, VStack } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { ValidatedForm } from "remix-validated-form";
import { Password, Submit } from "~/components/Form";
import { accountPasswordValidator } from "~/services/account";

const PasswordForm = () => {
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const onPasswordChange = () => {
    if (passwordRef.current && confirmPasswordRef.current) {
      setPasswordsMatch(
        passwordRef.current.value.length >= 6 &&
          confirmPasswordRef.current.value.length >= 6 &&
          passwordRef.current.value === confirmPasswordRef.current.value
      );
    }
  };

  return (
    <Box w="full">
      <ValidatedForm
        method="post"
        action="/app/account/password"
        validator={accountPasswordValidator}
      >
        <VStack spacing={4} my={4} w="full" alignItems="start" maxW={440}>
          <Password name="currentPassword" label="Current Password" />
          <Password
            ref={passwordRef}
            onChange={onPasswordChange}
            name="password"
            label="New Password"
          />
          <Password
            ref={confirmPasswordRef}
            onChange={onPasswordChange}
            name="confirmPassword"
            label="Confirm Password"
          />
          <Submit disabled={!passwordsMatch}>Update Password</Submit>
        </VStack>
      </ValidatedForm>
    </Box>
  );
};

export default PasswordForm;
