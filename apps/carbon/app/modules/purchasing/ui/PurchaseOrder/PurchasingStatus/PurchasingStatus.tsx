import { Status } from "@carbon/react";
import type { purchaseOrderStatusType } from "~/modules/purchasing";

type PurchasingStatusProps = {
  status?: (typeof purchaseOrderStatusType)[number] | null;
};

const PurchasingStatus = ({ status }: PurchasingStatusProps) => {
  switch (status) {
    case "Draft":
    case "To Review":
      return <Status color="gray">{status}</Status>;
    case "To Receive":
    case "To Receive and Invoice":
    case "To Invoice":
      return <Status color="orange">{status}</Status>;
    case "Completed":
      return <Status color="green">{status}</Status>;
    case "Closed":
    case "Rejected":
      return <Status color="red">{status}</Status>;
    default:
      return null;
  }
};

export default PurchasingStatus;
