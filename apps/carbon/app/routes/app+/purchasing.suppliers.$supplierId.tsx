import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import { SupplierForm } from "~/interfaces/Purchasing/Suppliers";
import { requirePermissions } from "~/services/auth";
import {
  getSupplier,
  getSupplierContacts,
  getSupplierLocations,
  supplierValidator,
  updateSupplier,
} from "~/services/purchasing";
import { flash } from "~/services/session";
import { assertIsPost, notFound } from "~/utils/http";
import { error, success } from "~/utils/result";

export async function loader({ request, params }: LoaderArgs) {
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
      "/app/purchasing/suppliers",
      await flash(request, error(supplier.error, "Failed to get supplier"))
    );

  if (contacts.error)
    return redirect(
      "/app/purchasing/suppliers",
      await flash(
        request,
        error(contacts.error, "Failed to get supplier contacts")
      )
    );

  if (locations.error)
    return redirect(
      "/app/purchasing/suppliers",
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
    id,
    name,
    supplierTypeId,
    supplierStatusId,
    accountManagerId,
    taxId,
    description,
  } = validation.data;

  if (!id) {
    return redirect(
      "/app/purchasing/suppliers",
      await flash(request, error(null, "Failed to update supplier"))
    );
  }

  const update = await updateSupplier(client, {
    id,
    name,
    supplierTypeId,
    supplierStatusId,
    accountManagerId,
    taxId,
    description,
    updatedBy: userId,
  });
  if (update.error) {
    return redirect(
      "/app/purchasing/suppliers",
      await flash(request, error(update.error, "Failed to update supplier"))
    );
  }

  return json(null, await flash(request, success("Updated supplier")));
}

export default function SuppliersNewRoute() {
  const { supplier, contacts, locations } = useLoaderData<typeof loader>();

  const initialValues = {
    id: supplier.id ?? undefined,
    name: supplier.name ?? "",
    supplierTypeId: supplier.supplierTypeId ?? undefined,
    supplierStatusId: supplier.supplierStatusId ?? undefined,
    accountManagerId: supplier.accountManagerId ?? undefined,
    taxId: supplier.taxId ?? "",
    description: supplier.description ?? "",
  };

  return (
    <SupplierForm
      initialValues={initialValues}
      contacts={contacts ?? []}
      locations={locations ?? []}
    />
  );
}
