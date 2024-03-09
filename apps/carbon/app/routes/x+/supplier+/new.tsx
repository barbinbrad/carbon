import { validationError, validator } from "@carbon/remix-validated-form";
import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import {
  SupplierForm,
  insertSupplier,
  supplierValidator,
} from "~/modules/purchasing";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session.server";
import { assertIsPost } from "~/utils/http";
import { path } from "~/utils/path";
import { error } from "~/utils/result";

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    create: "purchasing",
  });

  const validation = await validator(supplierValidator).validate(
    await request.formData()
  );

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
      path.to.suppliers,
      await flash(
        request,
        error(createSupplier.error, "Failed to insert supplier")
      )
    );
  }

  const supplierId = createSupplier.data?.id;

  return redirect(path.to.supplier(supplierId));
}

export default function SuppliersNewRoute() {
  const initialValues = {
    name: "",
  };
  return (
    <div className="w-1/2 max-w-[720px] min-w-[420px] mx-auto">
      <SupplierForm initialValues={initialValues} />
    </div>
  );
}
