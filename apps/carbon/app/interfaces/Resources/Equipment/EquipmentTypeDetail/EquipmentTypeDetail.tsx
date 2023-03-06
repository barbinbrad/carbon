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
  IconButton,
  List,
  ListItem,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { Link } from "@remix-run/react";
import { useState } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { IoMdTrash } from "react-icons/io";
import { ConfirmDelete } from "~/components/Modals";
import type { EquipmentTypeDetail as EquipmentTypeDetailType } from "~/interfaces/Resources/types";
import { useUrlParams } from "~/hooks";

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

  return (
    <>
      <Drawer onClose={onClose} isOpen={true} size="sm">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>{equipmentType.name}</DrawerHeader>
          <DrawerBody>
            {Array.isArray(equipmentType?.equipment) && (
              <List spacing={2}>
                {equipmentType.equipment.map((equipment) => {
                  return (
                    <ListItem key={equipment.id}>
                      <HStack>
                        <Text flexGrow={1}>{equipment.name}</Text>
                        <IconButton
                          as={Link}
                          to={equipment.id}
                          aria-label="Edit"
                          icon={<BsPencilSquare />}
                          variant="outline"
                        />
                        <IconButton
                          aria-label="Delete"
                          icon={<IoMdTrash />}
                          variant="outline"
                          onClick={() => onDelete(equipment)}
                        />
                      </HStack>
                    </ListItem>
                  );
                })}
              </List>
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
      <ConfirmDelete
        isOpen={deleteModal.isOpen}
        action={`/x/resources/equipment/delete/${selectedEquipment?.id}`}
        name={selectedEquipment?.name ?? ""}
        text={`Are you sure you want to deactivate the ${selectedEquipment?.name} equipment?`}
        onCancel={onDeleteCancel}
      />
    </>
  );
};

export default EquipmentTypeDetail;
