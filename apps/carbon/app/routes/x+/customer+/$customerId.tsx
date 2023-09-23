import { Grid } from "@chakra-ui/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import {
  CustomerHeader,
  CustomerSidebar,
  getCustomer,
  getCustomerContacts,
  getCustomerLocations,
} from "~/modules/sales";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { error } from "~/utils/result";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "sales",
  });

  const { customerId } = params;
  if (!customerId) throw new Error("Could not find customerId");

  const [customer, contacts, locations] = await Promise.all([
    getCustomer(client, customerId),
    getCustomerContacts(client, customerId),
    getCustomerLocations(client, customerId),
  ]);

  if (customer.error) {
    return redirect(
      "/x/sales/customers",
      await flash(
        request,
        error(customer.error, "Failed to load customer summary")
      )
    );
  }

  return json({
    customer: customer.data,
    contacts: contacts.data ?? [],
    locations: locations.data ?? [],
  });
}

export default function CustomerRoute() {
  return (
    <>
      <CustomerHeader />
      <Grid
        gridTemplateColumns={["1fr", "1fr", "1fr 4fr"]}
        gridColumnGap={4}
        w="full"
      >
        <CustomerSidebar />
        <Outlet />
      </Grid>
    </>
  );
}
