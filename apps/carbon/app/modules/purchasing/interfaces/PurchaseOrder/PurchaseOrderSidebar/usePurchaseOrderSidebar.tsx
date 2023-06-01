import { usePermissions } from "~/hooks";
import type { Role } from "~/types";

export function usePurchaseOrderSidebar() {
  const permissions = usePermissions();
  return [
    {
      name: "Header",
      to: "",
    },
    {
      name: "Line Items",
      to: "items",
      role: ["employee", "supplier"],
    },
    {
      name: "Delivery",
      to: "delivery",
      role: ["employee", "supplier"],
    },
    {
      name: "Taxes",
      to: "taxes",
      role: ["employee"],
    },
    {
      name: "Approvals",
      to: "approvals",
      role: ["employee"],
    },
    {
      name: "Internal Attachments",
      to: "internal-attachments",
      role: ["employee"],
    },
    {
      name: "External Attachments",
      to: "external-attachments",
      role: ["employee", "supplier"],
    },
  ].filter(
    (item) =>
      item.role === undefined ||
      item.role.some((role) => permissions.is(role as Role))
  );
}
