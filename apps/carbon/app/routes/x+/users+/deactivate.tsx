import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import { deactivateUser, deactivateUsersValidator } from "~/modules/users";
import type { UserAdminQueueData } from "~/queues";
import { userAdminQueue, UserAdminQueueType } from "~/queues";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { safeRedirect } from "~/utils/http";
import { error, success } from "~/utils/result";

export async function action({ request }: ActionFunctionArgs) {
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
    const jobs = users.map<{ name: string; data: UserAdminQueueData }>(
      (id) => ({
        name: `deactivate user ${id}`,
        data: {
          id,
          type: UserAdminQueueType.Deactivate,
        },
      })
    );

    try {
      await userAdminQueue.addBulk(jobs);
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
