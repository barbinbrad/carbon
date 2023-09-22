import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import {
  createSupplierAccount,
  createSupplierAccountValidator,
  CreateSupplierModal,
} from "~/modules/users";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { assertIsPost } from "~/utils/http";

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client } = await requirePermissions(request, {
    view: "users",
  });

  const validation = await createSupplierAccountValidator.validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const supplierRedirect = searchParams.get("supplier");

  const { id, supplier } = validation.data;
  const result = await createSupplierAccount(client, {
    id,
    supplierId: supplier,
  });

  if (supplierRedirect) {
    return redirect(
      `/x/supplier/${supplierRedirect}/contacts`,
      await flash(request, result)
    );
  }

  return redirect("/x/users/suppliers", await flash(request, result));
}

export default function () {
  return <CreateSupplierModal />;
}
