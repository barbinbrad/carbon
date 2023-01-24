import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import type { DeactivateUserQueueData } from "~/queues";
import { deactivateUsersQueue } from "~/queues";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { deactivateUser, deactivateUsersValidator } from "~/services/users";
import { safeRedirect } from "~/utils/http";
import { error, success } from "~/utils/result";

export async function action({ request }: ActionArgs) {
  const { client } = await requirePermissions(request, {
    delete: "users",
  });

  const validation = await deactivateUsersValidator.validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { users, redirectTo } = validation.data;

  if (users.length === 1) {
    const [userId] = users;
    const result = await deactivateUser(client, userId);

    return redirect(safeRedirect(redirectTo), await flash(request, result));
  } else {
    const jobs = users.map<{ name: string; data: DeactivateUserQueueData }>(
      (id) => ({
        name: `deactivate user ${id}`,
        data: {
          id,
        },
      })
    );

    try {
      await deactivateUsersQueue.addBulk(jobs);
      return redirect(
        safeRedirect(redirectTo),
        await flash(
          request,
          success("Success. Please check back in a few moments.")
        )
      );
    } catch (e) {
      return redirect(
        safeRedirect(redirectTo),
        await flash(request, error(e, "Failed to deactivate users"))
      );
    }
  }
}
