import { useColor } from "@carbon/react";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Image,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link, useActionData, useSearchParams } from "@remix-run/react";
import { ValidatedForm, validationError } from "remix-validated-form";

import { Input, Password, Submit } from "~/components/Form";
import {
  loginValidator,
  signInWithEmail,
  verifyAuthSession,
} from "~/services/auth";
import { createAuthSession, getAuthSession } from "~/services/session";
import type { FormActionData, Result } from "~/types";
import { assertIsPost } from "~/utils/http";
import { error } from "~/utils/result";

export const meta: MetaFunction = () => ({
  title: "Carbon | Login",
});

export async function loader({ request }: LoaderArgs) {
  const authSession = await getAuthSession(request);
  if (authSession && (await verifyAuthSession(authSession))) {
    if (authSession) return redirect("/x");
  }

  return null;
}

export async function action({ request }: ActionArgs): FormActionData {
  assertIsPost(request);
  const validation = await loginValidator.validate(await request.formData());

  if (validation.error) {
    return validationError(validation.error);
  }

  const { email, password, redirectTo } = validation.data;

  const authSession = await signInWithEmail(email, password);

  if (!authSession) {
    // delay on incorrect password as minimal brute force protection
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return json(error(authSession, "Invalid email/password"), {
      status: 500,
    });
  }

  return createAuthSession({
    request,
    authSession,
    redirectTo: redirectTo || "/x",
  });
}

export default function LoginRoute() {
  const result = useActionData<Result>();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? undefined;

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

      <Box rounded="lg" bg={useColor("white")} boxShadow="lg" w={380} p={8}>
        <ValidatedForm
          validator={loginValidator}
          defaultValues={{ redirectTo }}
          method="post"
        >
          <VStack spacing={4} alignItems="start">
            {result && result?.message && (
              <Alert status="error">
                <AlertIcon />
                <AlertTitle>{result?.message}</AlertTitle>
              </Alert>
            )}
            <Input name="email" label="Email" />
            <Password name="password" label="Password" type="password" />
            <Input name="redirectTo" value={redirectTo} type="hidden" />
            <Submit w="full">Sign in</Submit>
            <Link to="/forgot-password" color={useColor("black")}>
              Forgot password?
            </Link>
          </VStack>
        </ValidatedForm>
      </Box>
    </>
  );
}
