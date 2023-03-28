import { ActionMenu, Dot } from "@carbon/react";
import { Avatar, Grid, MenuItem, Text, VStack } from "@chakra-ui/react";
import type { Action } from "~/types";

type ContactProps = {
  contact: {
    firstName: string | null;
    lastName: string | null;
    email: string | null;
  };
  user?: {
    id: string;
    active: boolean | null;
  } | null;
  actions: Action[];
};

enum UserStatus {
  Active,
  Inactive,
  None,
}

const Contact = ({ contact, user, actions }: ContactProps) => {
  const name = `${contact.firstName ?? ""} ${contact.lastName ?? ""}`;
  const userStatus = user
    ? user.active
      ? UserStatus.Active
      : UserStatus.Inactive
    : UserStatus.None;

  return (
    <Grid w="full" gridColumnGap={4} gridTemplateColumns="auto 1fr auto">
      <Avatar size="sm" name={`${name}`} />
      <VStack spacing={0} alignItems="start">
        <Text fontWeight="bold" noOfLines={1}>
          {name}
          {userStatus === UserStatus.Active && (
            <Dot color="green.400" title="Active" />
          )}
          {userStatus === UserStatus.Inactive && (
            <Dot color="red.400" title="Inactive" />
          )}
        </Text>
        <Text fontSize="sm" color="gray.500" noOfLines={1}>
          {contact.email ?? ""}
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

export default Contact;
