import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import {
  createSupplierAccount,
  createSupplierValidator,
} from "~/services/users";
import { assertIsPost } from "~/utils/http";
import { CreateSupplierModal } from "~/interfaces/Users/Suppliers";

export async function action({ request }: ActionArgs) {
  assertIsPost(request);
  const { client } = await requirePermissions(request, {
    view: "users",
  });

  const validation = await createSupplierValidator.validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { id, supplier } = validation.data;
  const result = await createSupplierAccount(client, {
    id,
    supplierId: supplier,
  });

  return redirect("/x/users/suppliers", await flash(request, result));
}

export default function () {
  return <CreateSupplierModal />;
}
