import type { AvatarProps } from "@carbon/react";
import { HStack } from "@carbon/react";
import { useCustomers } from "~/stores";
import Avatar from "./Avatar";

type CustomerAvatarProps = AvatarProps & {
  customerId: string | null;
};

const CustomerAvatar = ({
  customerId,
  size,
  ...props
}: CustomerAvatarProps) => {
  const [customers] = useCustomers();

  if (!customerId) return null;

  const customer = customers.find((s) => s.id === customerId) ?? {
    name: "",
    id: "",
  };

  return (
    <HStack className="truncate">
      <Avatar size={size ?? "xs"} {...props} name={customer?.name ?? ""} />
      <span>{customer.name}</span>
    </HStack>
  );
};

export default CustomerAvatar;
