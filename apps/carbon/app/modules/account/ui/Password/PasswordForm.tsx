import { VStack } from "@carbon/react";
import { ValidatedForm } from "@carbon/remix-validated-form";
import { useRef, useState } from "react";
import { Password, Submit } from "~/components/Form";
import { accountPasswordValidator } from "~/modules/account";
import { path } from "~/utils/path";

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
    <div className="w-full">
      <ValidatedForm
        method="post"
        action={path.to.accountPassword}
        validator={accountPasswordValidator}
      >
        <VStack spacing={4} className="my-4 max-w-[440px]">
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
          <Submit isDisabled={!passwordsMatch}>Update Password</Submit>
        </VStack>
      </ValidatedForm>
    </div>
  );
};

export default PasswordForm;
