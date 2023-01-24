import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import type { Permission } from "~/interfaces/Users/types";
import type { BulkPermissionsQueueData } from "~/queues";
import { bulkPermissionsQueue } from "~/queues";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import {
  bulkPermissionsValidator,
  userPermissionsValidator,
} from "~/services/users";
import { assertIsPost } from "~/utils/http";
import { error, success } from "~/utils/result";

export async function action({ request }: ActionArgs) {
  assertIsPost(request);
  await requirePermissions(request, {
    update: "users",
  });

  const validation = await bulkPermissionsValidator.validate(
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
      "/app/users/employees",
      await flash(request, error(permissions, "Failed to parse permissions"))
    );
  }

  const jobs = userIds.map<{ name: string; data: BulkPermissionsQueueData }>(
    (id) => ({
      name: `permission update for ${id}`,
      data: {
        id,
        permissions,
        addOnly,
      },
    })
  );

  await bulkPermissionsQueue.addBulk(jobs);

  return redirect(
    "/app/users/employees",
    await flash(request, success("Updating user permissions"))
  );
}
