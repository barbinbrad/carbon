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
import { Address } from "~/components";
import { ConfirmDelete } from "~/components/Modals";
import { usePermissions } from "~/hooks";
import type { SupplierLocation } from "~/modules/purchasing/types";

type SupplierLocationsProps = {
  locations: SupplierLocation[];
};

const SupplierLocations = ({ locations }: SupplierLocationsProps) => {
  const navigate = useNavigate();
  const { supplierId } = useParams();
  if (!supplierId) throw new Error("supplierId is required");
  const permissions = usePermissions();
  const canEdit = permissions.can("create", "purchasing");
  const isEmpty = locations === undefined || locations?.length === 0;

  const deleteLocationModal = useDisclosure();
  const [location, setSelectedLocation] = useState<SupplierLocation>();

  const getActions = useCallback(
    (location: SupplierLocation) => {
      const actions = [];
      if (permissions.can("update", "purchasing")) {
        actions.push({
          label: "Edit Location",
          icon: <BsPencilSquare />,
          onClick: () => {
            navigate(location.id);
          },
        });
      }
      if (permissions.can("delete", "purchasing")) {
        actions.push({
          label: "Delete Location",
          icon: <IoMdTrash />,
          onClick: () => {
            setSelectedLocation(location);
            deleteLocationModal.onOpen();
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
    [permissions, deleteLocationModal, navigate, supplierId]
  );

  return (
    <>
      <Card w="full">
        <CardHeader display="flex" justifyContent="space-between">
          <Heading size="md" display="inline-flex">
            Locations
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
                You haven’t created any locations yet.
              </Text>
            </Box>
          ) : (
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
        </CardBody>
      </Card>

      {deleteLocationModal.isOpen && (
        <ConfirmDelete
          action={`/x/supplier/${supplierId}/locations/delete/${location?.id}`}
          // @ts-ignore
          name={location?.address?.city ?? ""}
          text="Are you sure you want to delete this location?"
          onCancel={deleteLocationModal.onClose}
          onSubmit={deleteLocationModal.onClose}
        />
      )}

      <Outlet />
    </>
  );
};

export default SupplierLocations;
