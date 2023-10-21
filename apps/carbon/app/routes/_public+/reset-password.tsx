import { useColor } from "@carbon/react";
import {
  Box,
  Button,
  HStack,
  Image,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useNavigate } from "@remix-run/react";
import { ValidatedForm, validationError } from "remix-validated-form";
import { Password, Submit } from "~/components/Form";
import { resetPassword } from "~/modules/users";
import { resetPasswordValidator } from "~/services/auth";
import { flash, requireAuthSession } from "~/services/session";
import { assertIsPost } from "~/utils/http";
import { path } from "~/utils/path";
import { error, success } from "~/utils/result";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAuthSession(request);
  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const validation = await resetPasswordValidator.validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { password } = validation.data;

  const { userId } = await requireAuthSession(request, { verify: true });
  const updatePassword = await resetPassword(userId, password);

  if (updatePassword.error) {
    return json(
      {},
      await flash(
        request,
        error(updatePassword.error, "Failed to update password")
      )
    );
  }

  return redirect(
    path.to.authenticatedRoot,
    await flash(request, success("Password updated"))
  );
}

export default function ResetPasswordRoute() {
  const boxBackground = useColor("white");
  const navigate = useNavigate();

  return (
    <>
      <Image
        src={useColorModeValue(
          "/carbon-logo-dark.png",
          "/carbon-logo-light.png"
        )}
        alt="Carbon Logo"
        maxW={100}
        marginBottom={3}
      />

      <Box rounded="lg" bg={boxBackground} boxShadow="lg" w={380} p={8}>
        <ValidatedForm
          method="post"
          action={path.to.resetPassord}
          validator={resetPasswordValidator}
        >
          <VStack spacing={4} alignItems="start">
            <Text>Please select a new password.</Text>

            <Password name="password" label="New Password" />
            <HStack spacing={4}>
              <Submit w="full">Reset Password</Submit>
              <Button
                size="md"
                onClick={() => navigate(path.to.authenticatedRoot)}
              >
                Skip
              </Button>
            </HStack>
          </VStack>
        </ValidatedForm>
      </Box>
    </>
  );
}
