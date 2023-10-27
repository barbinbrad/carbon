import { VStack } from "@chakra-ui/react";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { getPaymentTermsList } from "~/modules/accounting";
import {
  getShippingMethodsList,
  getShippingTermsList,
} from "~/modules/inventory";
import { getSupplierStatuses, getSupplierTypes } from "~/modules/purchasing";
import { requirePermissions } from "~/services/auth";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";

export const meta: MetaFunction = () => {
  return [{ title: "Carbon | Part" }];
};

export const handle: Handle = {
  breadcrumb: "Purchasing",
  to: path.to.purchasing,
  module: "purchasing",
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "purchasing",
  });

  const [
    supplierTypes,
    supplierStatuses,
    paymentTerms,
    shippingMethods,
    shippingTerms,
  ] = await Promise.all([
    getSupplierTypes(client),
    getSupplierStatuses(client),
    getPaymentTermsList(client),
    getShippingMethodsList(client),
    getShippingTermsList(client),
  ]);

  return json({
    supplierStatuses: supplierStatuses.data ?? [],
    supplierTypes: supplierTypes.data ?? [],
    paymentTerms: paymentTerms.data ?? [],
    shippingMethods: shippingMethods.data ?? [],
    shippingTerms: shippingTerms.data ?? [],
  });
}

export default function SupplierRoute() {
  return (
    <VStack w="full" h="full" spacing={4} p={4}>
      <Outlet />
    </VStack>
  );
}
