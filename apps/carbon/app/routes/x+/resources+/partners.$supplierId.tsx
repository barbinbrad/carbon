import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import {
  PartnerForm,
  partnerValidator,
  getPartner,
  upsertPartner,
} from "~/modules/resources";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { assertIsPost, notFound } from "~/utils/http";
import { error, success } from "~/utils/result";

export async function loader({ request, params }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    view: "resources",
  });

  const { supplierId } = params;
  if (!supplierId) throw notFound("Partner ID was not found");

  const partner = await getPartner(client, supplierId);

  if (partner.error) {
    return redirect(
      "/x/resources/partners",
      await flash(request, error(partner.error, "Failed to get partner"))
    );
  }

  return json({
    partner: partner.data,
  });
}

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
  if (!id) throw notFound("Partner ID was not found");

  const updatePartner = await upsertPartner(client, {
    id,
    hoursPerWeek,
    updatedBy: userId,
  });

  if (updatePartner.error) {
    return redirect(
      "/x/resources/partners",
      await flash(
        request,
        error(updatePartner.error, "Failed to create partner.")
      )
    );
  }

  return redirect(
    "/x/resources/partners",
    await flash(request, success("Partner updated."))
  );
}

export default function PartnerRoute() {
  const { partner } = useLoaderData<typeof loader>();

  const initialValues = {
    id: partner.id,
    hoursPerWeek: partner.hoursPerWeek,
  };

  return <PartnerForm initialValues={initialValues} />;
}
