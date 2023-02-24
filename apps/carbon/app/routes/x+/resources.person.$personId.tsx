import { Box, Grid, VStack } from "@chakra-ui/react";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import {
  PersonAbilities,
  PersonHeader,
  PersonTabs,
  PersonSchedule,
} from "~/interfaces/Resources/Person";
import logger from "~/lib/logger";
import {
  accountProfileValidator,
  getAccount,
  getPrivateAttributes,
  getPublicAttributes,
  updatePublicAccount,
} from "~/services/account";
import { requirePermissions } from "~/services/auth";
import { getEmployeeAbilities, getNotes } from "~/services/resources";
import { flash } from "~/services/session";
import { assertIsPost } from "~/utils/http";
import { error, success } from "~/utils/result";

export async function loader({ request, params }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    view: "resources",
  });

  const { personId } = params;

  if (!personId) {
    throw redirect(
      "/app/x/resources/people",
      await flash(request, error(null, "No person ID provided"))
    );
  }

  const [user, notes, publicAttributes, privateAttributes, employeeAbilities] =
    await Promise.all([
      getAccount(client, personId),
      getNotes(client, personId),
      getPublicAttributes(client, personId),
      getPrivateAttributes(client, personId),
      getEmployeeAbilities(client, personId),
    ]);

  if (user.error || !user.data) {
    return redirect(
      "/x/resources/people",
      await flash(request, error(user.error, "Failed to get user"))
    );
  }

  if (notes.error) logger.error(notes.error);
  if (publicAttributes.error) logger.error(publicAttributes.error);
  if (privateAttributes.error) logger.error(privateAttributes.error);
  if (employeeAbilities.error) logger.error(employeeAbilities.error);

  return json({
    user: user.data,
    notes: notes.data ?? [],
    publicAttributes: publicAttributes.data ?? [],
    privateAttributes: privateAttributes.data ?? [],
    employeeAbilities: employeeAbilities.data ?? [],
  });
}

export async function action({ request, params }: ActionArgs) {
  assertIsPost(request);
  const { client } = await requirePermissions(request, {
    update: "resources",
  });
  const { personId } = params;
  if (!personId) throw new Error("No person ID provided");

  const formData = await request.formData();

  if (formData.get("intent") === "about") {
    const validation = await accountProfileValidator.validate(formData);

    if (validation.error) {
      return validationError(validation.error);
    }

    const { firstName, lastName, about } = validation.data;

    const updateAccount = await updatePublicAccount(client, {
      id: personId,
      firstName,
      lastName,
      about,
    });
    if (updateAccount.error)
      return json(
        {},
        await flash(
          request,
          error(updateAccount.error, "Failed to update profile")
        )
      );

    return json({}, await flash(request, success("Updated profile")));
  }

  return null;
}

export default function PersonRoute() {
  const {
    user,
    publicAttributes,
    privateAttributes,
    notes,
    employeeAbilities,
  } = useLoaderData<typeof loader>();

  return (
    <Box p="4" w="full">
      <PersonHeader user={user} />
      <Grid gridTemplateColumns="5fr 3fr" gridColumnGap={4} w="full">
        <VStack spacing={4}>
          <PersonTabs
            user={user}
            publicAttributes={publicAttributes}
            privateAttributes={privateAttributes}
            notes={notes}
          />
        </VStack>
        <VStack spacing={4}>
          <PersonSchedule />
          <PersonAbilities abilities={employeeAbilities} />
        </VStack>
      </Grid>
    </Box>
  );
}
