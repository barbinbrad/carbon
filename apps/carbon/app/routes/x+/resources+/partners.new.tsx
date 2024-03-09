import { validationError, validator } from "@carbon/remix-validated-form";
import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useUrlParams } from "~/hooks";
import {
  PartnerForm,
  partnerValidator,
  upsertPartner,
} from "~/modules/resources";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session.server";
import { assertIsPost } from "~/utils/http";
import { path } from "~/utils/path";
import { error, success } from "~/utils/result";

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    create: "resources",
  });

  const validation = await validator(partnerValidator).validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { supplierId, ...data } = validation.data;

  const createPartner = await upsertPartner(client, {
    ...data,
    createdBy: userId,
  });

  if (createPartner.error) {
    return redirect(
      path.to.partners,
      await flash(
        request,
        error(createPartner.error, "Failed to create partner")
      )
    );
  }

  return redirect(
    path.to.partners,
    await flash(request, success("Partner created."))
  );
}

export default function NewPartnerRoute() {
  const [params] = useUrlParams();
  const initialValues = {
    id: params.get("id") ?? "",
    supplierId: params.get("supplierId") ?? "",
    hoursPerWeek: 0,
    abilityId: "",
  };

  return <PartnerForm initialValues={initialValues} />;
}
