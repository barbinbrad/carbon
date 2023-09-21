import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import {
  getSupplier,
  getSupplierContacts,
  getSupplierLocations,
  SupplierForm,
  supplierValidator,
  updateSupplier,
} from "~/modules/purchasing";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { assertIsPost, notFound } from "~/utils/http";
import { error, success } from "~/utils/result";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "purchasing",
  });

  const { supplierId } = params;
  if (!supplierId) throw notFound("supplierTypeId not found");

  const [supplier, contacts, locations] = await Promise.all([
    getSupplier(client, supplierId),
    getSupplierContacts(client, supplierId),
    getSupplierLocations(client, supplierId),
  ]);
  if (supplier.error)
    return redirect(
      "/x/purchasing/suppliers",
      await flash(request, error(supplier.error, "Failed to get supplier"))
    );

  if (contacts.error)
    return redirect(
      "/x/purchasing/suppliers",
      await flash(
        request,
        error(contacts.error, "Failed to get supplier contacts")
      )
    );

  if (locations.error)
    return redirect(
      "/x/purchasing/suppliers",
      await flash(
        request,
        error(locations.error, "Failed to get supplier locations")
      )
    );

  return json({
    supplier: supplier.data,
    contacts: contacts.data,
    locations: locations.data,
  });
}

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

  if (!id) {
    return redirect(
      "/x/purchasing/suppliers",
      await flash(request, error(null, "Failed to update supplier"))
    );
  }

  const update = await updateSupplier(client, {
    id,
    ...data,
    updatedBy: userId,
  });
  if (update.error) {
    return redirect(
      "/x/purchasing/suppliers",
      await flash(request, error(update.error, "Failed to update supplier"))
    );
  }

  return json(null, await flash(request, success("Updated supplier")));
}

export default function SupplierEditRoute() {
  const { supplier } = useLoaderData<typeof loader>();

  const initialValues = {
    id: supplier.id ?? undefined,
    name: supplier.name ?? "",
    supplierTypeId: supplier.supplierTypeId ?? undefined,
    supplierStatusId: supplier.supplierStatusId ?? undefined,
    accountManagerId: supplier.accountManagerId ?? undefined,
    taxId: supplier.taxId ?? "",
    defaultCurrencyCode: supplier.defaultCurrencyCode ?? "",
    defaultPaymentTermId: supplier.defaultPaymentTermId ?? undefined,
    defaultShippingMethodId: supplier.defaultShippingMethodId ?? undefined,
    defaultShippingTermId: supplier.defaultShippingTermId ?? undefined,
  };

  return <SupplierForm initialValues={initialValues} />;
}
