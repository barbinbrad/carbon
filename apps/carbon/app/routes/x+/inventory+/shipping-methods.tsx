import { VStack } from "@chakra-ui/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { getAccountsList } from "~/modules/accounting";
import {
  getShippingMethods,
  ShippingMethodsTable,
  ShippingMethodsTableFilters,
} from "~/modules/inventory";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { getGenericQueryFilters } from "~/utils/query";
import { error } from "~/utils/result";

export async function loader({ request }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "inventory",
    role: "employee",
  });

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const name = searchParams.get("name");
  const { limit, offset, sorts } = getGenericQueryFilters(searchParams);

  const [shippingMethods] = await Promise.all([
    getShippingMethods(client, {
      name,
      limit,
      offset,
      sorts,
    }),
    getAccountsList(client),
  ]);

  if (shippingMethods.error) {
    return redirect(
      "/x/inventory",
      await flash(request, error(null, "Error loading shipping methods"))
    );
  }

  return json({
    shippingMethods: shippingMethods.data ?? [],
    count: shippingMethods.count ?? 0,
  });
}

export default function ShippingMethodsRoute() {
  const { shippingMethods, count } = useLoaderData<typeof loader>();

  return (
    <VStack w="full" h="full" spacing={0}>
      <ShippingMethodsTableFilters />
      <ShippingMethodsTable data={shippingMethods ?? []} count={count ?? 0} />
      <Outlet />
    </VStack>
  );
}
