import { usePermissions } from "~/hooks";
import type { Role } from "~/types";

type Props = {
  externalDocuments?: number;
  internalDocuments?: number;
};

export function usePurchaseOrderSidebar({
  internalDocuments = 0,
  externalDocuments = 0,
}: Props) {
  const permissions = usePermissions();
  return [
    {
      name: "Summary",
      to: "summary",
    },
    {
      name: "Delivery",
      to: "delivery",
      role: ["employee", "supplier"],
    },
    {
      name: "Payment",
      to: "payment",
      role: ["employee"],
    },
    {
      name: "Internal Attachments",
      to: "internal",
      role: ["employee"],
      count: internalDocuments,
    },
    {
      name: "External Attachments",
      to: "external",
      role: ["employee", "supplier"],
      count: externalDocuments,
    },
  ].filter(
    (item) =>
      item.role === undefined ||
      item.role.some((role) => permissions.is(role as Role))
  );
}
