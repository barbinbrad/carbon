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
import { useNavigate, useParams } from "@remix-run/react";
import { useCallback, useState } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { IoMdAdd, IoMdTrash } from "react-icons/io";
import { Address } from "~/components";
import { ConfirmDelete } from "~/components/Modals";
import { usePermissions } from "~/hooks";
import type { SupplierLocation } from "~/modules/purchasing";
import SupplierLocationForm from "./SupplierLocationForm";

type SupplierLocationProps = {
  locations?: SupplierLocation[];
  isEditing?: boolean;
};

const SupplierLocations = ({
  locations = [],
  isEditing = false,
}: SupplierLocationProps) => {
  const navigate = useNavigate();
  const permissions = usePermissions();
  const locationDrawer = useDisclosure();
  const deleteContactModal = useDisclosure();

  const { supplierId } = useParams();

  const [location, setLocation] = useState<SupplierLocation | undefined>(
    undefined
  );

  const isEmpty = locations === undefined || locations?.length === 0;

  const getActions = useCallback(
    (location: SupplierLocation) => {
      const actions = [];
      if (permissions.can("update", "purchasing")) {
        actions.push({
          label: "Edit Location",
          icon: <BsPencilSquare />,
          onClick: () => {
            setLocation(location);
            locationDrawer.onOpen();
          },
        });
      }
      if (permissions.can("delete", "purchasing")) {
        actions.push({
          label: "Delete Location",
          icon: <IoMdTrash />,
          onClick: () => {
            setLocation(location);
            deleteContactModal.onOpen();
          },
        });
      }
      if (permissions.can("create", "resources")) {
        actions.push({
          label: "Add Partner",
          icon: <IoMdAdd />,
          onClick: () => {
            navigate(
              `/x/resources/partners/new?id=${location.id}&supplierId=${supplierId}`
            );
          },
        });
      }
      return actions;
    },
    [permissions, locationDrawer, deleteContactModal, navigate, supplierId]
  );

  return (
    <>
      <VStack alignItems="start" w="full" spacing={4} mb={4}>
        <HStack w="full" justifyContent="space-between">
          <Heading size="md">Locations</Heading>
          {permissions.can("create", "purchasing") && (
            <IconButton
              icon={<IoMdAdd />}
              aria-label="Add location"
              variant="outline"
              onClick={() => {
                setLocation(undefined);
                locationDrawer.onOpen();
              }}
            />
          )}
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
                    actions={getActions(location)}
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
              setLocation(undefined);
              locationDrawer.onOpen();
            }}
            isDisabled={!isEditing}
          >
            New Location
          </Button>
        )}
      </VStack>
      {locationDrawer.isOpen && (
        <SupplierLocationForm
          onClose={locationDrawer.onClose}
          location={location}
        />
      )}
      {deleteContactModal.isOpen && (
        <ConfirmDelete
          action={`/x/purchasing/suppliers/${supplierId}/location/delete/${location?.id}`}
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

export default SupplierLocations;
