import { usePermissions } from "~/hooks";
import type { Role } from "~/types";

type Props = {
  lines?: number;
  externalDocuments?: number;
  internalDocuments?: number;
};

export function usePurchaseOrderSidebar({
  lines = 0,
  internalDocuments = 0,
  externalDocuments = 0,
}: Props) {
  const permissions = usePermissions();
  return [
    {
      name: "Summary",
      to: "",
    },
    {
      name: "Lines",
      to: "lines",
      role: ["employee", "supplier"],
      count: lines,
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
