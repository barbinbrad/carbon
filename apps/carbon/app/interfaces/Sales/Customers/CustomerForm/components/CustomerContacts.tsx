import {
  Button,
  HStack,
  Heading,
  IconButton,
  List,
  ListItem,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "@remix-run/react";
import { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import type {
  CustomerContact,
  CustomerLocation,
} from "~/interfaces/Sales/types";
import { Contact } from "~/components";
import { ConfirmDelete } from "~/components/Modals";
import CustomerContactForm from "./CustomerContactsForm";
import { usePermissions } from "~/hooks";

type CustomerContactProps = {
  contacts?: CustomerContact[];
  locations?: CustomerLocation[];
  isEditing?: boolean;
};

const CustomerContacts = ({
  contacts = [],
  locations = [],
  isEditing = false,
}: CustomerContactProps) => {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const permissions = usePermissions();

  const [contact, setContact] = useState<CustomerContact | undefined>(
    undefined
  );

  const contactDrawer = useDisclosure();
  const deleteContactModal = useDisclosure();

  const isEmpty = contacts === undefined || contacts?.length === 0;

  return (
    <>
      <VStack alignItems="start" w="full" spacing={4} mb={4}>
        <HStack w="full" justifyContent="space-between">
          <Heading size="md">Contacts</Heading>
          {permissions.can("create", "sales") && (
            <IconButton
              icon={<IoMdAdd />}
              aria-label="Add contact"
              variant="outline"
              onClick={() => {
                setContact(undefined);
                contactDrawer.onOpen();
              }}
            />
          )}
        </HStack>
        {isEmpty && (
          <Text color="gray.500" fontSize="sm">
            You haven’t created any contacts yet.
          </Text>
        )}
        {!isEmpty && (
          <List w="full" spacing={4}>
            {contacts?.map((contact) => (
              <ListItem key={contact.id}>
                {contact.contact &&
                !Array.isArray(contact.contact) &&
                !Array.isArray(contact.user) ? (
                  <Contact
                    contact={contact.contact}
                    user={contact.user}
                    onDelete={
                      permissions.can("delete", "sales")
                        ? () => {
                            setContact(contact);
                            deleteContactModal.onOpen();
                          }
                        : undefined
                    }
                    onEdit={
                      permissions.can("update", "sales")
                        ? () => {
                            setContact(contact);
                            contactDrawer.onOpen();
                          }
                        : undefined
                    }
                    onCreateAccount={
                      permissions.can("create", "users") &&
                      contact.user === null
                        ? () =>
                            navigate(
                              `/x/users/customers/new?id=${contact.id}&customer=${customerId}`
                            )
                        : undefined
                    }
                  />
                ) : null}
              </ListItem>
            ))}
          </List>
        )}
        {isEmpty && permissions.can("create", "sales") && (
          <Button
            leftIcon={<IoMdAdd />}
            colorScheme="brand"
            onClick={() => {
              setContact(undefined);
              contactDrawer.onOpen();
            }}
            disabled={!isEditing}
          >
            New Contact
          </Button>
        )}
      </VStack>
      {contactDrawer.isOpen && (
        <CustomerContactForm
          onClose={contactDrawer.onClose}
          contact={contact}
          locations={locations}
        />
      )}
      {deleteContactModal.isOpen && (
        <ConfirmDelete
          action={`/x/sales/customers/${customerId}/contact/delete/${contact?.id}`}
          // @ts-ignore
          name={`${contact?.contact.firstName} ${contact?.contact.lastName}`}
          text="Are you sure you want to delete this contact?"
          onCancel={deleteContactModal.onClose}
          onSubmit={deleteContactModal.onClose}
        />
      )}
    </>
  );
};

export default CustomerContacts;
