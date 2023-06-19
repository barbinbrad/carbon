import { usePermissions } from "~/hooks";
import type { Role } from "~/types";

type Props = {
  lines?: number;
};

export function usePurchaseOrderSidebar({ lines = 0 }: Props) {
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
