import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import {
  PartnerForm,
  partnerValidator,
  upsertPartner,
} from "~/modules/resources";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { assertIsPost } from "~/utils/http";
import { error, success } from "~/utils/result";

export async function action({ request }: ActionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    create: "resources",
  });

  const validation = await partnerValidator.validate(await request.formData());

  if (validation.error) {
    return validationError(validation.error);
  }

  const { id, hoursPerWeek } = validation.data;

  const createPartner = await upsertPartner(client, {
    id,
    hoursPerWeek,
    createdBy: userId,
  });

  if (createPartner.error) {
    return redirect(
      "/x/resources/partners",
      await flash(
        request,
        error(createPartner.error, "Failed to create partner.")
      )
    );
  }

  return redirect(
    "/x/resources/partners",
    await flash(request, success("Partner created."))
  );
}

export default function NewPartnerRoute() {
  const initialValues = {
    id: "",
    hoursPerWeek: 0,
  };

  return <PartnerForm initialValues={initialValues} />;
}
