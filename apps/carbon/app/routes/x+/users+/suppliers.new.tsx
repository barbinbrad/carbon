import { validationError, validator } from "@carbon/remix-validated-form";
import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import {
  CreateSupplierModal,
  createSupplierAccountValidator,
} from "~/modules/users";
import { createSupplierAccount } from "~/modules/users/users.server";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session.server";
import { assertIsPost } from "~/utils/http";
import { path } from "~/utils/path";

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client } = await requirePermissions(request, {
    view: "users",
  });

  const validation = await validator(createSupplierAccountValidator).validate(
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
      path.to.supplierContacts(supplierRedirect),
      await flash(request, result)
    );
  }

  return redirect(path.to.supplierAccounts, await flash(request, result));
}

export default function () {
  return <CreateSupplierModal />;
}
