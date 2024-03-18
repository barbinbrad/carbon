import { validationError, validator } from "@carbon/remix-validated-form";
import { useLoaderData } from "@remix-run/react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@vercel/remix";
import { json, redirect } from "@vercel/remix";
import {
  PartnerForm,
  getPartner,
  partnerValidator,
  upsertPartner,
} from "~/modules/resources";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session.server";
import { getCustomFields, setCustomFields } from "~/utils/form";
import { assertIsPost, notFound } from "~/utils/http";
import { path } from "~/utils/path";
import { error, success } from "~/utils/result";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "resources",
  });

  const { supplierLocationId, abilityId } = params;
  if (!supplierLocationId) throw notFound("Partner ID was not found");
  if (!abilityId) throw notFound("Ability ID was not found");

  const partner = await getPartner(client, supplierLocationId, abilityId);

  if (partner.error) {
    return redirect(
      path.to.partners,
      await flash(request, error(partner.error, "Failed to get partner"))
    );
  }

  return json({
    partner: partner.data,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    create: "resources",
  });

  const formData = await request.formData();
  const validation = await validator(partnerValidator).validate(formData);

  if (validation.error) {
    return validationError(validation.error);
  }

  const { supplierId, ...data } = validation.data;

  const updatePartner = await upsertPartner(client, {
    ...data,
    updatedBy: userId,
    customFields: setCustomFields(formData),
  });

  if (updatePartner.error) {
    return redirect(
      path.to.partners,
      await flash(
        request,
        error(updatePartner.error, "Failed to create partner")
      )
    );
  }

  return redirect(
    path.to.partners,
    await flash(request, success("Partner updated."))
  );
}

export default function PartnerRoute() {
  const { partner } = useLoaderData<typeof loader>();

  const initialValues = {
    id: partner.supplierLocationId ?? "",
    supplierId: partner.supplierId ?? "",
    hoursPerWeek: partner.hoursPerWeek ?? 0,
    abilityId: partner.abilityId ?? "",
    ...getCustomFields(partner.customFields),
  };

  return <PartnerForm key={initialValues.id} initialValues={initialValues} />;
}
