import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  List,
  ListItem,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { Link, Outlet, useNavigate, useParams } from "@remix-run/react";
import { useCallback, useState } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { IoMdAdd, IoMdTrash } from "react-icons/io";
import { Contact } from "~/components";
import { ConfirmDelete } from "~/components/Modals";
import { usePermissions } from "~/hooks";
import type { CustomerContact } from "~/modules/sales/types";

type CustomerContactsProps = {
  contacts: CustomerContact[];
};

const CustomerContacts = ({ contacts }: CustomerContactsProps) => {
  const navigate = useNavigate();
  const { customerId } = useParams();
  if (!customerId) throw new Error("customerId is required");
  const permissions = usePermissions();
  const canEdit = permissions.can("create", "sales");
  const isEmpty = contacts === undefined || contacts?.length === 0;

  const deleteContactModal = useDisclosure();
  const [contact, setSelectedContact] = useState<CustomerContact>();

  const getActions = useCallback(
    (contact: CustomerContact) => {
      const actions = [];

      actions.push({
        label: permissions.can("update", "sales")
          ? "Edit Contact"
          : "View Contact",
        icon: <BsPencilSquare />,
        onClick: () => {
          navigate(contact.id);
        },
      });

      if (permissions.can("delete", "sales")) {
        actions.push({
          label: "Delete Contact",
          icon: <IoMdTrash />,
          onClick: () => {
            setSelectedContact(contact);
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
              `/x/users/customers/new?id=${contact.id}&customer=${customerId}`
            );
          },
        });
      }

      return actions;
    },
    [permissions, deleteContactModal, navigate, customerId]
  );

  return (
    <>
      <Card w="full">
        <CardHeader display="flex" justifyContent="space-between">
          <Heading size="md" display="inline-flex">
            Contacts
          </Heading>
          {canEdit && (
            <Button colorScheme="brand" as={Link} to="new">
              New
            </Button>
          )}
        </CardHeader>
        <CardBody>
          {isEmpty ? (
            <Box w="full" my={8} textAlign="center">
              <Text color="gray.500" fontSize="sm">
                You haven’t created any contacts yet.
              </Text>
            </Box>
          ) : (
            <List w="full" spacing={4}>
              {contacts?.map((contact) => (
                <ListItem key={contact.id}>
                  {contact.contact &&
                  !Array.isArray(contact.contact) &&
                  !Array.isArray(contact.user) ? (
                    <Contact
                      contact={contact.contact}
                      url={`/x/customer/${customerId}/contacts/${contact.id}`}
                      user={contact.user}
                      actions={getActions(contact)}
                    />
                  ) : null}
                </ListItem>
              ))}
            </List>
          )}
        </CardBody>
      </Card>

      <ConfirmDelete
        action={`/x/customer/${customerId}/contacts/delete/${contact?.id}`}
        isOpen={deleteContactModal.isOpen}
        name={`${contact?.contact?.firstName} ${contact?.contact?.lastName}`}
        text="Are you sure you want to delete this contact?"
        onCancel={deleteContactModal.onClose}
        onSubmit={deleteContactModal.onClose}
      />

      <Outlet />
    </>
  );
};

export default CustomerContacts;
