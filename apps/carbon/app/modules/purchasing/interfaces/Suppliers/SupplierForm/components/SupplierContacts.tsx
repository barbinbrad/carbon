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
import { useCallback, useState } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { IoMdAdd, IoMdTrash } from "react-icons/io";
import { Contact } from "~/components";
import { ConfirmDelete } from "~/components/Modals";
import { usePermissions } from "~/hooks";
import type { SupplierContact, SupplierLocation } from "~/modules/purchasing";
import SupplierContactForm from "./SupplierContactsForm";

type SupplierContactProps = {
  contacts?: SupplierContact[];
  locations?: SupplierLocation[];
  isEditing?: boolean;
};

const SupplierContacts = ({
  contacts = [],
  locations = [],
  isEditing = false,
}: SupplierContactProps) => {
  const { supplierId } = useParams();
  const navigate = useNavigate();
  const permissions = usePermissions();

  const [contact, setContact] = useState<SupplierContact | undefined>(
    undefined
  );

  const contactDrawer = useDisclosure();
  const deleteContactModal = useDisclosure();

  const isEmpty = contacts === undefined || contacts?.length === 0;

  const getActions = useCallback(
    (contact: SupplierContact) => {
      const actions = [];
      if (permissions.can("update", "purchasing")) {
        actions.push({
          label: "Edit Contact",
          icon: <BsPencilSquare />,
          onClick: () => {
            setContact(contact);
            contactDrawer.onOpen();
          },
        });
      }
      if (permissions.can("delete", "purchasing")) {
        actions.push({
          label: "Delete Contact",
          icon: <IoMdTrash />,
          onClick: () => {
            setContact(contact);
            deleteContactModal.onOpen();
          },
        });
      }

      if (permissions.can("create", "users") && contact.user === null) {
        actions.push({
          label: "Create Account",
          icon: <IoMdAdd />,
          onClick: () => {
            navigate(
              `/x/users/suppliers/new?id=${contact.id}&supplier=${supplierId}`
            );
          },
        });
      }

      return actions;
    },
    [permissions, supplierId, contactDrawer, deleteContactModal, navigate]
  );

  return (
    <>
      <VStack alignItems="start" w="full" spacing={4} mb={4}>
        <HStack w="full" justifyContent="space-between">
          <Heading size="md">Contacts</Heading>
          {permissions.can("create", "purchasing") && (
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
                    actions={getActions(contact)}
                  />
                ) : null}
              </ListItem>
            ))}
          </List>
        )}
        {isEmpty && permissions.can("create", "purchasing") && (
          <Button
            leftIcon={<IoMdAdd />}
            colorScheme="brand"
            onClick={() => {
              setContact(undefined);
              contactDrawer.onOpen();
            }}
            isDisabled={!isEditing}
          >
            New Contact
          </Button>
        )}
      </VStack>
      {contactDrawer.isOpen && (
        <SupplierContactForm
          onClose={contactDrawer.onClose}
          contact={contact}
          locations={locations}
        />
      )}
      {deleteContactModal.isOpen && (
        <ConfirmDelete
          action={`/x/purchasing/suppliers/${supplierId}/contact/delete/${contact?.id}`}
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

export default SupplierContacts;
