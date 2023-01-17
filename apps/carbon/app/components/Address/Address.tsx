import { ActionMenu } from "@carbon/react";
import { Grid, Icon, MenuItem, Text, VStack } from "@chakra-ui/react";
import { BsPencilSquare, BsPinMapFill } from "react-icons/bs";
import { IoMdTrash } from "react-icons/io";

type AddressProps = {
  address: {
    city: string | null;
    state: string | null;
    addressLine1: string | null;
    postalCode: string | null;
  };
  onEdit?: () => void;
  onDelete?: () => void;
};

const Address = ({ address, onEdit, onDelete }: AddressProps) => {
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
      {(onEdit || onDelete) && (
        <ActionMenu>
          {onEdit && (
            <MenuItem icon={<BsPencilSquare />} onClick={onEdit}>
              Edit Location
            </MenuItem>
          )}
          {onDelete && (
            <MenuItem icon={<IoMdTrash />} onClick={onDelete}>
              Delete Location
            </MenuItem>
          )}
        </ActionMenu>
      )}
    </Grid>
  );
};

export default Address;
