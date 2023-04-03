import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import { PartForm, insertPart, partValidator } from "~/modules/parts";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { assertIsPost } from "~/utils/http";
import { error, success } from "~/utils/result";

export async function action({ request }: ActionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    create: "parts",
  });

  const validation = await partValidator.validate(await request.formData());

  if (validation.error) {
    return validationError(validation.error);
  }

  const createPart = await insertPart(client, {
    ...validation.data,
    createdBy: userId,
  });
  if (createPart.error) {
    return redirect(
      "/x/parts/search",
      await flash(request, error(createPart.error, "Failed to insert part"))
    );
  }

  const partId = createPart.data[0]?.id;

  return redirect(
    `/x/parts/${partId}`,
    await flash(request, success("Created part"))
  );
}

export default function PartsNewRoute() {
  const initialValues = {};

  return <PartForm initialValues={initialValues} />;
}
