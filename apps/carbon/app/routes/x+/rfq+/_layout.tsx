import { VStack } from "@carbon/react";
import type { MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";

export const meta: MetaFunction = () => {
  return [{ title: "Carbon | Request for Quote" }];
};

export const handle: Handle = {
  breadcrumb: "Purchasing",
  to: path.to.purchaseOrders,
  module: "purchasing",
};

export default function RequestForQuoteRoute() {
  return (
    <VStack spacing={4} className="h-full p-2">
      <Outlet />
    </VStack>
  );
}
