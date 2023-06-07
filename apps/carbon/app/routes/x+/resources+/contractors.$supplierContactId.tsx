import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import {
  ContractorForm,
  contractorValidator,
  getContractor,
  upsertContractor,
} from "~/modules/resources";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { assertIsPost, notFound } from "~/utils/http";
import { error, success } from "~/utils/result";

export async function loader({ request, params }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    view: "resources",
  });

  const { supplierContactId } = params;
  if (!supplierContactId) throw notFound("Contractor ID was not found");

  const contractor = await getContractor(client, supplierContactId);

  if (contractor.error) {
    return redirect(
      "/x/resources/contractors",
      await flash(request, error(contractor.error, "Failed to get contractor"))
    );
  }

  return json({
    contractor: contractor.data,
  });
}

export async function action({ request }: ActionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    create: "resources",
  });

  const validation = await contractorValidator.validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { id, hoursPerWeek, abilities } = validation.data;
  if (!id) throw notFound("Contractor ID was not found");

  const updateContractor = await upsertContractor(client, {
    id,
    hoursPerWeek,
    abilities: abilities ?? [],
    updatedBy: userId,
  });

  if (updateContractor.error) {
    return redirect(
      "/x/resources/contractors",
      await flash(
        request,
        error(updateContractor.error, "Failed to create contractor.")
      )
    );
  }

  return redirect(
    "/x/resources/contractors",
    await flash(request, success("Contractor updated."))
  );
}

export default function ContractorRoute() {
  const { contractor } = useLoaderData<typeof loader>();

  const initialValues = {
    id: contractor.supplierContactId ?? "",
    supplierId: contractor.supplierId ?? "",
    hoursPerWeek: contractor.hoursPerWeek ?? 0,
    abilities: contractor.abilityIds ?? ([] as string[]),
  };

  return <ContractorForm initialValues={initialValues} />;
}
