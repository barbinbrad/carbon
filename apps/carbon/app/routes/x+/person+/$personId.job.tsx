import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session.server";
import { path } from "~/utils/path";
import { error, success } from "~/utils/result";

import { validationError, validator } from "@carbon/remix-validated-form";
import {
  PersonJob,
  employeeJobValidator,
  getEmployeeJob,
  upsertEmployeeJob,
} from "~/modules/resources";
import { assertIsPost } from "~/utils/http";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "resources",
  });

  const { personId } = params;
  if (!personId) throw new Error("Could not find personId");

  const job = await getEmployeeJob(client, personId);
  if (job.error) {
    return redirect(
      path.to.people,
      await flash(request, error(job.error, "Failed to load job"))
    );
  }

  return json({
    job: job.data,
  });
}

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client } = await requirePermissions(request, {
    update: "resources",
  });
  const { personId } = params;
  if (!personId) throw new Error("No person ID provided");

  const validation = await validator(employeeJobValidator).validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const updateJob = await upsertEmployeeJob(client, personId, validation.data);
  if (updateJob.error) {
    return redirect(
      path.to.personJob(personId),
      await flash(request, error(updateJob.error, "Failed to update job"))
    );
  }

  return redirect(
    path.to.personJob(personId),
    await flash(request, success("Successfully updated job"))
  );
}

export default function PersonJobRoute() {
  const { job } = useLoaderData<typeof loader>();

  return <PersonJob job={job} />;
}
