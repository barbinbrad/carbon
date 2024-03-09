import { validationError, validator } from "@carbon/remix-validated-form";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { partValidator, upsertPart } from "~/modules/parts";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session.server";
import { assertIsPost } from "~/utils/http";
import { error } from "~/utils/result";

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    create: "parts",
  });

  const validation = await validator(partValidator).validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const createPart = await upsertPart(client, {
    ...validation.data,
    active: true,
    createdBy: userId,
  });
  if (createPart.error) {
    return json(
      createPart,
      await flash(request, error(createPart.error, "Failed to insert part"))
    );
  }

  const partId = createPart.data?.id;
  if (!partId) throw new Error("Part ID not found");

  return json(createPart, { status: 201 });
}
