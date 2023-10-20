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
import type { WorkCellTypeDetailType } from "~/modules/resources";
import type { ListItem } from "~/types";

type WorkCell = NonNullable<WorkCellTypeDetailType["workCell"]>;

type WorkCellTypeDetailProps = {
  workCellType: WorkCellTypeDetailType;
  onClose: () => void;
};

const WorkCellTypeDetail = ({
  workCellType,
  onClose,
}: WorkCellTypeDetailProps) => {
  const [params] = useUrlParams();

  const deleteModal = useDisclosure();
  const [selectedWorkCell, setSelectedWorkCell] = useState<
    ListItem | undefined
  >();

  const onDelete = (data?: WorkCell) => {
    if (!data || Array.isArray(data)) return;
    setSelectedWorkCell(data);
    deleteModal.onOpen();
  };

  const onDeleteCancel = () => {
    setSelectedWorkCell(undefined);
    deleteModal.onClose();
  };

  const renderContextMenu = (workCell: WorkCell) => {
    if (!workCell || Array.isArray(workCell)) return null;
    return (
      <>
        <MenuItem as={Link} to={workCell.id} icon={<BsPencilSquare />}>
          Edit Cell
        </MenuItem>
        <MenuItem onClick={() => onDelete(workCell)} icon={<IoMdTrash />}>
          Delete Cell
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
          <DrawerHeader>{workCellType.name}</DrawerHeader>
          <DrawerBody>
            {Array.isArray(workCellType?.workCell) && (
              <VStack
                alignItems="start"
                divider={<StackDivider borderColor="gray.200" />}
                spacing={4}
                w="full"
              >
                {workCellType.workCell.map((workCell) => {
                  if (
                    !workCell ||
                    Array.isArray(workCell) ||
                    Array.isArray(workCell.location) ||
                    Array.isArray(workCell.department)
                  )
                    return null;
                  return (
                    <HStack key={workCell.id} w="full">
                      <VStack spacing={0} flexGrow={1} alignItems="start">
                        <Text fontWeight="bold">{workCell.name}</Text>
                        <Text fontSize="sm" color="gray.500">
                          {workCell.location?.name} /{" "}
                          {workCell.department?.name}
                        </Text>
                      </VStack>
                      <ActionMenu>{renderContextMenu(workCell)}</ActionMenu>
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
              New Work Cell
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <ConfirmDelete
        isOpen={deleteModal.isOpen}
        action={`/x/resources/work-cells/cell/delete/${selectedWorkCell?.id}`}
        name={selectedWorkCell?.name ?? ""}
        text={`Are you sure you want to deactivate ${selectedWorkCell?.name}?`}
        onCancel={onDeleteCancel}
      />
    </>
  );
};

export default WorkCellTypeDetail;
