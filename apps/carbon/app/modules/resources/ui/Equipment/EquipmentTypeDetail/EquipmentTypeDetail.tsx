import { ActionMenu } from "@carbon/react";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  MenuItem,
  StackDivider,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { Link } from "@remix-run/react";
import { useState } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { IoMdTrash } from "react-icons/io";
import { ConfirmDelete } from "~/components/Modals";
import { useUrlParams } from "~/hooks";
import type { EquipmentTypeDetailType } from "~/modules/resources";
import { path } from "~/utils/path";

type Equipment = {
  id: string;
  name: string;
};

type EquipmentTypeDetailProps = {
  equipmentType: EquipmentTypeDetailType;
  onClose: () => void;
};

const EquipmentTypeDetail = ({
  equipmentType,
  onClose,
}: EquipmentTypeDetailProps) => {
  const [params] = useUrlParams();

  const deleteModal = useDisclosure();
  const [selectedEquipment, setSelectedEquipment] = useState<
    Equipment | undefined
  >();

  const onDelete = (data?: Equipment) => {
    setSelectedEquipment(data);
    deleteModal.onOpen();
  };

  const onDeleteCancel = () => {
    setSelectedEquipment(undefined);
    deleteModal.onClose();
  };

  const renderContextMenu = (equipment: Equipment) => {
    return (
      <>
        <MenuItem as={Link} to={equipment.id} icon={<BsPencilSquare />}>
          Edit Unit
        </MenuItem>
        <MenuItem onClick={() => onDelete(equipment)} icon={<IoMdTrash />}>
          Delete Unit
        </MenuItem>
      </>
    );
  };

  return (
    <>
      <Drawer onClose={onClose} isOpen={true} size="sm">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>{equipmentType.name}</DrawerHeader>
          <DrawerBody>
            {Array.isArray(equipmentType?.equipment) && (
              <VStack
                alignItems="start"
                divider={<StackDivider borderColor="gray.200" />}
                spacing={4}
                w="full"
              >
                {equipmentType.equipment.map((equipment) => {
                  return (
                    <HStack key={equipment.id} w="full">
                      <VStack spacing={0} flexGrow={1} alignItems="start">
                        <Text fontWeight="bold">{equipment.name}</Text>
                        <Text fontSize="sm" color="gray.500">
                          {/* @ts-ignore */}
                          {equipment.location?.name}
                        </Text>
                      </VStack>
                      <ActionMenu>{renderContextMenu(equipment)}</ActionMenu>
                    </HStack>
                  );
                })}
              </VStack>
            )}
          </DrawerBody>
          <DrawerFooter>
            <Button
              as={Link}
              to={`new?${params.toString()}`}
              colorScheme="brand"
              size="md"
            >
              New Equipment
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      {selectedEquipment && selectedEquipment.id && (
        <ConfirmDelete
          isOpen={deleteModal.isOpen}
          action={path.to.deleteEquipment(selectedEquipment.id)}
          name={selectedEquipment?.name ?? ""}
          text={`Are you sure you want to deactivate ${selectedEquipment?.name}?`}
          onCancel={onDeleteCancel}
        />
      )}
    </>
  );
};

export default EquipmentTypeDetail;
