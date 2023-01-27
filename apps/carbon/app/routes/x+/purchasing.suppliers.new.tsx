import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import { SupplierForm } from "~/interfaces/Purchasing/Suppliers";
import { requirePermissions } from "~/services/auth";
import { insertSupplier, supplierValidator } from "~/services/purchasing";
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

  const {
    name,
    supplierTypeId,
    supplierStatusId,
    accountManagerId,
    taxId,
    description,
  } = validation.data;

  const createSupplier = await insertSupplier(client, {
    name,
    supplierTypeId,
    supplierStatusId,
    accountManagerId,
    taxId,
    description,
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

  const supplierId = createSupplier.data[0]?.id;

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
