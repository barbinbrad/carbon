import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import {
  insertSupplier,
  SupplierForm,
  supplierValidator,
} from "~/modules/purchasing";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { assertIsPost } from "~/utils/http";
import { error } from "~/utils/result";

export async function action({ request }: ActionFunctionArgs) {
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

  return redirect(`/x/supplier/${supplierId}`);
}

export default function SuppliersNewRoute() {
  const initialValues = {
    name: "",
  };
  return <SupplierForm initialValues={initialValues} />;
}
