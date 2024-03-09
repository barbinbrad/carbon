import { validationError, validator } from "@carbon/remix-validated-form";
import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import type { Permission } from "~/modules/users";
import {
  bulkPermissionsValidator,
  userPermissionsValidator,
} from "~/modules/users";
import type { UserPermissionsQueueData } from "~/queues";
import { userPermissionsQueue } from "~/queues";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session.server";
import { assertIsPost } from "~/utils/http";
import { path } from "~/utils/path";
import { error, success } from "~/utils/result";

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  await requirePermissions(request, {
    update: "users",
  });

  const validation = await validator(bulkPermissionsValidator).validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { editType, userIds, data } = validation.data;
  const addOnly = editType === "add";
  const permissions: Record<string, Permission> = JSON.parse(data);

  if (
    !Object.values(permissions).every(
      (permission) => userPermissionsValidator.safeParse(permission).success
    )
  ) {
    return redirect(
      path.to.employeeAccounts,
      await flash(request, error(permissions, "Failed to parse permissions"))
    );
  }

  const jobs = userIds.map<{ name: string; data: UserPermissionsQueueData }>(
    (id) => ({
      name: `permission update for ${id}`,
      data: {
        id,
        permissions,
        addOnly,
      },
    })
  );

  await userPermissionsQueue.addBulk(jobs);

  return redirect(
    path.to.employeeAccounts,
    await flash(request, success("Updating user permissions"))
  );
}
