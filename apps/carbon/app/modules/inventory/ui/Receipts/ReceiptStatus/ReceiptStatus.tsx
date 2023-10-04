import { Tag } from "@chakra-ui/react";
import type { receiptStatusType } from "~/modules/inventory";

type ReceiptStatusProps = {
  status?: (typeof receiptStatusType)[number] | null;
};

const ReceiptStatus = ({ status }: ReceiptStatusProps) => {
  switch (status) {
    case "Draft":
      return <Tag>{status}</Tag>;
    case "Pending":
      return <Tag colorScheme="orange">{status}</Tag>;
    case "Posted":
      return <Tag colorScheme="green">{status}</Tag>;
    default:
      return null;
  }
};

export default ReceiptStatus;
