import { Box, Grid, VStack } from "@chakra-ui/react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import logger from "~/lib/logger";
import {
  accountProfileValidator,
  getAccount,
  getPrivateAttributes,
  getPublicAttributes,
  updatePublicAccount,
} from "~/modules/account";
import type { EmployeeJob } from "~/modules/resources";
import {
  employeeJobValidator,
  getEmployeeAbilities,
  getEmployeeJob,
  PersonAbilities,
  PersonDaysOff,
  PersonHeader,
  PersonOvertime,
  PersonTabs,
  upsertEmployeeJob,
} from "~/modules/resources";
import { getNotes } from "~/modules/shared";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { assertIsPost } from "~/utils/http";
import { error, success } from "~/utils/result";

export async function loader({ request, params }: LoaderFunctionArgs) {
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

  const [
    user,
    notes,
    publicAttributes,
    privateAttributes,
    employeeAbilities,
    employeeJob,
  ] = await Promise.all([
    getAccount(client, personId),
    getNotes(client, personId),
    getPublicAttributes(client, personId),
    getPrivateAttributes(client, personId),
    getEmployeeAbilities(client, personId),
    getEmployeeJob(client, personId),
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
  if (employeeJob.error) logger.error(employeeJob.error);

  return json({
    user: user.data,
    notes: notes.data ?? [],
    publicAttributes: publicAttributes.data ?? [],
    privateAttributes: privateAttributes.data ?? [],
    employeeAbilities: employeeAbilities.data ?? [],
    employeeJob: employeeJob.data ?? ({} as EmployeeJob),
  });
}

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client } = await requirePermissions(request, {
    update: "resources",
  });
  const { personId } = params;
  if (!personId) throw new Error("No person ID provided");

  const formData = await request.formData();
  const intent = formData.get("intent");
  if (intent === "about") {
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
  if (intent === "job") {
    const validation = await employeeJobValidator.validate(formData);

    if (validation.error) {
      return validationError(validation.error);
    }

    const { title, startDate, locationId, shiftId, managerId } =
      validation.data;

    const updateJob = await upsertEmployeeJob(client, personId, {
      title: title ?? null,
      startDate: startDate ?? null,
      locationId: locationId ?? null,
      shiftId: shiftId ?? null,
      managerId: managerId ?? null,
    });
    if (updateJob.error) {
      return json(
        {},
        await flash(request, error(updateJob.error, "Failed to update job"))
      );
    }

    return json({}, await flash(request, success("Successfully updated job")));
  }

  return null;
}

export default function PersonRoute() {
  const {
    user,
    notes,
    publicAttributes,
    privateAttributes,
    employeeAbilities,
    employeeJob,
  } = useLoaderData<typeof loader>();

  return (
    <Box p="4" w="full">
      <PersonHeader user={user} />
      <Grid gridTemplateColumns="5fr 3fr" gridColumnGap={4} w="full">
        <VStack spacing={4}>
          <PersonTabs
            user={user}
            job={employeeJob}
            notes={notes}
            publicAttributes={publicAttributes}
            privateAttributes={privateAttributes}
          />
        </VStack>
        <VStack spacing={4}>
          <PersonDaysOff />
          <PersonOvertime />
          <PersonAbilities abilities={employeeAbilities} />
        </VStack>
      </Grid>
    </Box>
  );
}
