import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import type { ResendInvitesQueueData } from "~/queues";
import { resendInvitesQueue } from "~/queues";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { resendInvite, resendInviteValidator } from "~/services/users";
import { error, success } from "~/utils/result";

export async function action({ request }: ActionArgs) {
  const { client } = await requirePermissions(request, {
    delete: "users",
  });

  const validation = await resendInviteValidator.validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { users } = validation.data;

  if (users.length === 1) {
    const [userId] = users;
    const result = await resendInvite(client, userId);

    return json({}, await flash(request, result));
  } else {
    const jobs = users.map<{ name: string; data: ResendInvitesQueueData }>(
      (id) => ({
        name: `reinvite user ${id}`,
        data: {
          id,
        },
      })
    );

    try {
      await resendInvitesQueue.addBulk(jobs);
      return json(
        {},
        await flash(request, success("Successfully added invites to queue."))
      );
    } catch (e) {
      return json(
        {},
        await flash(request, error(e, "Failed to reinvite users"))
      );
    }
  }
}
