import { Grid } from "@chakra-ui/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import {
  getSupplier,
  getSupplierContacts,
  getSupplierLocations,
  SupplierHeader,
  SupplierSidebar,
} from "~/modules/purchasing";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { error } from "~/utils/result";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "purchasing",
  });

  const { supplierId } = params;
  if (!supplierId) throw new Error("Could not find supplierId");

  const [supplier, contacts, locations] = await Promise.all([
    getSupplier(client, supplierId),
    getSupplierContacts(client, supplierId),
    getSupplierLocations(client, supplierId),
  ]);

  if (supplier.error) {
    return redirect(
      "/x/purchasing/suppliers",
      await flash(
        request,
        error(supplier.error, "Failed to load supplier summary")
      )
    );
  }

  return json({
    supplier: supplier.data,
    contacts: contacts.data ?? [],
    locations: locations.data ?? [],
  });
}

export default function SupplierRoute() {
  return (
    <>
      <SupplierHeader />
      <Grid
        gridTemplateColumns={["1fr", "1fr", "1fr 4fr"]}
        gridColumnGap={4}
        w="full"
      >
        <SupplierSidebar />
        <Outlet />
      </Grid>
    </>
  );
}
