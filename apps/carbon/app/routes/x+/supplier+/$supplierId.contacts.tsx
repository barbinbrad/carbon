import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getSupplierContacts, SupplierContacts } from "~/modules/purchasing";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { error } from "~/utils/result";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "purchasing",
  });

  const { supplierId } = params;
  if (!supplierId) throw new Error("Could not find supplierId");

  const contacts = await getSupplierContacts(client, supplierId);
  if (contacts.error) {
    return redirect(
      `/x/supplier/${supplierId}`,
      await flash(
        request,
        error(contacts.error, "Failed to fetch supplier contacts")
      )
    );
  }

  return json({
    contacts: contacts.data ?? [],
  });
}

export default function SupplierContactsRoute() {
  const { contacts } = useLoaderData<typeof loader>();

  return <SupplierContacts contacts={contacts} />;
}
