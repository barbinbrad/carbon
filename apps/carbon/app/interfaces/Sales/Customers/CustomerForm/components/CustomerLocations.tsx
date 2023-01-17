import {
  Button,
  Heading,
  HStack,
  IconButton,
  List,
  ListItem,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { useParams } from "@remix-run/react";
import { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { Address } from "~/components";
import { ConfirmDelete } from "~/components/Modals";
import type { CustomerLocation } from "~/interfaces/Sales/types";
import CustomerLocationForm from "./CustomerLocationForm";

type CustomerLocationProps = {
  locations?: CustomerLocation[];
  isEditing?: boolean;
};

const CustomerLocations = ({
  locations = [],
  isEditing = false,
}: CustomerLocationProps) => {
  const locationDrawer = useDisclosure();
  const deleteContactModal = useDisclosure();

  const { customerId } = useParams();

  const [location, setLocation] = useState<CustomerLocation | undefined>(
    undefined
  );

  const isEmpty = locations === undefined || locations?.length === 0;

  return (
    <>
      <VStack alignItems="start" w="full" spacing={4} mb={4}>
        <HStack w="full" justifyContent="space-between">
          <Heading size="md">Locations</Heading>
          <IconButton
            icon={<IoMdAdd />}
            aria-label="Add location"
            variant="outline"
            onClick={() => {
              setLocation(undefined);
              locationDrawer.onOpen();
            }}
          />
        </HStack>
        {isEmpty && (
          <Text color="gray.500" fontSize="sm">
            You haven’t created any locations yet.
          </Text>
        )}
        {!isEmpty && (
          <List w="full" spacing={4}>
            {locations?.map((location) => (
              <ListItem key={location.id}>
                {location.address && !Array.isArray(location.address) ? (
                  <Address
                    address={location.address}
                    onDelete={() => {
                      setLocation(location);
                      deleteContactModal.onOpen();
                    }}
                    onEdit={() => {
                      setLocation(location);
                      locationDrawer.onOpen();
                    }}
                  />
                ) : null}
              </ListItem>
            ))}
          </List>
        )}
        {isEmpty && (
          <Button
            leftIcon={<IoMdAdd />}
            colorScheme="brand"
            onClick={() => {
              setLocation(undefined);
              locationDrawer.onOpen();
            }}
            disabled={!isEditing}
          >
            New Location
          </Button>
        )}
      </VStack>
      {locationDrawer.isOpen && (
        <CustomerLocationForm
          onClose={locationDrawer.onClose}
          location={location}
        />
      )}
      {deleteContactModal.isOpen && (
        <ConfirmDelete
          action={`/app/sales/customers/${customerId}/location/delete/${location?.id}`}
          // @ts-ignore
          name={location?.address?.city ?? ""}
          text="Are you sure you want to delete this location?"
          onCancel={deleteContactModal.onClose}
          onSubmit={deleteContactModal.onClose}
        />
      )}
    </>
  );
};

export default CustomerLocations;
