import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import { useUrlParams } from "~/hooks";
import {
  ContractorForm,
  contractorValidator,
  upsertContractor,
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

  const validation = await contractorValidator.validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { id, hoursPerWeek, abilities } = validation.data;

  const createContractor = await upsertContractor(client, {
    id,
    hoursPerWeek,
    abilities: abilities ?? [],
    createdBy: userId,
  });

  if (createContractor.error) {
    return redirect(
      "/x/resources/contractors",
      await flash(
        request,
        error(createContractor.error, "Failed to create contractor.")
      )
    );
  }

  return redirect(
    "/x/resources/contractors",
    await flash(request, success("Contractor created."))
  );
}

export default function NewContractorRoute() {
  const [params] = useUrlParams();
  const initialValues = {
    id: params.get("id") ?? "",
    supplierId: params.get("supplierId") ?? "",
    hoursPerWeek: 0,
    abilities: [] as string[],
  };

  return <ContractorForm initialValues={initialValues} />;
}
