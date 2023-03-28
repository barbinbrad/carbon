import { ActionMenu } from "@carbon/react";
import { Grid, Icon, MenuItem, Text, VStack } from "@chakra-ui/react";
import { BsPinMapFill } from "react-icons/bs";
import type { Action } from "~/types";

type AddressProps = {
  address: {
    city: string | null;
    state: string | null;
    addressLine1: string | null;
    postalCode: string | null;
  };
  actions: Action[];
};

const Address = ({ address, actions }: AddressProps) => {
  const location = `${address.city ?? ""}, ${address.state ?? ""}`;
  const addressZip = `${address.addressLine1 ?? ""} ${
    address.postalCode ?? ""
  }`;
  return (
    <Grid w="full" gridColumnGap={4} gridTemplateColumns="auto 1fr auto">
      <Icon as={BsPinMapFill} w={8} h={8} />
      <VStack spacing={0} alignItems="start">
        <Text fontWeight="bold" noOfLines={1}>
          {location}
        </Text>
        <Text fontSize="sm" color="gray.500" noOfLines={1}>
          {addressZip}
        </Text>
      </VStack>
      {actions.length > 0 && (
        <ActionMenu>
          {actions.map((action) => (
            <MenuItem
              key={action.label}
              icon={action.icon}
              onClick={action.onClick}
            >
              {action.label}
            </MenuItem>
          ))}
        </ActionMenu>
      )}
    </Grid>
  );
};

export default Address;
