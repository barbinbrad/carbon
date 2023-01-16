import { ActionMenu } from "@carbon/react";
import { Avatar, Grid, MenuItem, Text, VStack } from "@chakra-ui/react";
import { BsPencilSquare } from "react-icons/bs";
import { IoMdTrash } from "react-icons/io";

type ContactProps = {
  contact: {
    firstName: string | null;
    lastName: string | null;
    email: string | null;
  };
  onEdit?: () => void;
  onDelete?: () => void;
};

const Contact = ({ contact, onEdit, onDelete }: ContactProps) => {
  const name = `${contact.firstName ?? ""} ${contact.lastName ?? ""}`;
  return (
    <Grid w="full" gridColumnGap={4} gridTemplateColumns="auto 1fr auto">
      <Avatar size="sm" name={`${name}`} />
      <VStack spacing={0} alignItems="start">
        <Text fontWeight="bold" noOfLines={1}>
          {name}
        </Text>
        <Text fontSize="sm" color="gray.500" noOfLines={1}>
          {contact.email ?? ""}
        </Text>
      </VStack>
      {(onEdit || onDelete) && (
        <ActionMenu>
          <MenuItem icon={<BsPencilSquare />} onClick={onEdit}>
            Edit Contact
          </MenuItem>
          <MenuItem icon={<IoMdTrash />} onClick={onDelete}>
            Delete Contact
          </MenuItem>
        </ActionMenu>
      )}
    </Grid>
  );
};

export default Contact;
