import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import {
  getPartner,
  PartnerForm,
  partnerValidator,
  upsertPartner,
} from "~/modules/resources";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { assertIsPost, notFound } from "~/utils/http";
import { path } from "~/utils/path";
import { error, success } from "~/utils/result";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "resources",
  });

  const { supplierLocationId } = params;
  if (!supplierLocationId) throw notFound("Partner ID was not found");

  const partner = await getPartner(client, supplierLocationId);

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

  const validation = await partnerValidator.validate(await request.formData());

  if (validation.error) {
    return validationError(validation.error);
  }

  const { id, hoursPerWeek, abilities } = validation.data;
  if (!id) throw notFound("Partner ID was not found");

  const updatePartner = await upsertPartner(client, {
    id,
    hoursPerWeek,
    abilities,
    updatedBy: userId,
  });

  if (updatePartner.error) {
    return redirect(
      path.to.partners,
      await flash(
        request,
        error(updatePartner.error, "Failed to create partner.")
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
    abilities: partner.abilityIds ?? ([] as string[]),
  };

  return <PartnerForm initialValues={initialValues} />;
}
