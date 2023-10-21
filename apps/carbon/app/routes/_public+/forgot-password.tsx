import { useColor } from "@carbon/react";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Image,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { ValidatedForm, validationError } from "remix-validated-form";

import { Input, Submit } from "~/components/Form";
import { getUserByEmail } from "~/modules/users";
import { forgotPasswordValidator, sendMagicLink } from "~/services/auth";
import { getAuthSession } from "~/services/session";
import type { FormActionData, Result } from "~/types";
import { assertIsPost } from "~/utils/http";
import { path } from "~/utils/path";
import { error, success } from "~/utils/result";

export const meta: MetaFunction = () => {
  return [
    {
      title: "Carbon | Forgot Password",
    },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const authSession = await getAuthSession(request);
  if (authSession) return redirect(path.to.authenticatedRoot);
  return null;
}

export async function action({ request }: ActionFunctionArgs): FormActionData {
  assertIsPost(request);
  const validation = await forgotPasswordValidator.validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { email } = validation.data;
  const user = await getUserByEmail(email);

  if (user.data && user.data.active) {
    const authSession = await sendMagicLink(email);

    if (!authSession) {
      return json(error(authSession, "Failed to send magic link"), {
        status: 500,
      });
    }
  }

  return json(success("Success"));
}

export default function ForgotPasswordRoute() {
  const actionData = useActionData<Result>();
  const boxBackground = useColor("white");

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
      {actionData?.success ? (
        <Alert
          status="success"
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          height="240px"
          p={8}
        >
          <AlertIcon boxSize="40px" mr={0} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            Success
          </AlertTitle>
          <AlertDescription maxWidth="sm">
            If you have an account, you should receive an email shortly with a
            link to log in.
          </AlertDescription>
        </Alert>
      ) : (
        <Box rounded="lg" bg={boxBackground} boxShadow="lg" w={380} p={8}>
          <ValidatedForm validator={forgotPasswordValidator} method="post">
            <VStack spacing={4} alignItems="start">
              <Text>
                Please enter your email address to search for your account.
              </Text>
              {actionData?.success === false && (
                <Alert status="error">
                  <AlertIcon />
                  <AlertTitle>{actionData?.message}</AlertTitle>
                </Alert>
              )}
              <Input name="email" label="Email" />
              <Submit w="full">Search</Submit>
            </VStack>
          </ValidatedForm>
        </Box>
      )}
    </>
  );
}
