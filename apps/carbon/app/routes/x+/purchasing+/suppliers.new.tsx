import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import {
  SupplierForm,
  insertSupplier,
  supplierValidator,
} from "~/modules/purchasing";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { assertIsPost } from "~/utils/http";
import { error, success } from "~/utils/result";

export async function action({ request }: ActionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    create: "purchasing",
  });

  const validation = await supplierValidator.validate(await request.formData());

  if (validation.error) {
    return validationError(validation.error);
  }

  const { id, ...data } = validation.data;

  const createSupplier = await insertSupplier(client, {
    ...data,
    createdBy: userId,
  });
  if (createSupplier.error) {
    return redirect(
      "/x/purchasing/suppliers",
      await flash(
        request,
        error(createSupplier.error, "Failed to insert supplier")
      )
    );
  }

  const supplierId = createSupplier.data?.id;

  return redirect(
    `/x/purchasing/suppliers/${supplierId}`,
    await flash(request, success("Created supplier"))
  );
}

export default function SuppliersNewRoute() {
  const initialValues = {
    name: "",
  };
  return <SupplierForm initialValues={initialValues} />;
}
