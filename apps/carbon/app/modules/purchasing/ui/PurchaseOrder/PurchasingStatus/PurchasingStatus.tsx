import { Tag } from "@chakra-ui/react";
import type { purchaseOrderStatusType } from "~/modules/purchasing";

type PurchasingStatusProps = {
  status?: (typeof purchaseOrderStatusType)[number] | null;
};

const PurchasingStatus = ({ status }: PurchasingStatusProps) => {
  switch (status) {
    case "Draft":
    case "To Review":
      return <Tag>{status}</Tag>;
    case "To Receive":
    case "To Receive and Invoice":
    case "To Invoice":
      return <Tag colorScheme="orange">{status}</Tag>;
    case "Completed":
      return <Tag colorScheme="green">{status}</Tag>;
    case "Closed":
    case "Rejected":
      return <Tag colorScheme="red">{status}</Tag>;
    default:
      return null;
  }
};

export default PurchasingStatus;
