import { Button, Text, useDisclosure, VStack } from "@chakra-ui/react";
import { IoMdAdd } from "react-icons/io";
import type { SupplierLocation } from "~/interfaces/Purchasing/types";

type SupplierLocationProps = {
  locations?: SupplierLocation[];
  isEditing?: boolean;
};

const SupplierLocations = ({
  locations = [],
  isEditing = false,
}: SupplierLocationProps) => {
  const locationsModal = useDisclosure();
  const isEmpty = locations === undefined || locations?.length === 0;

  return (
    <>
      <VStack alignItems="start" w="full" spacing={2}>
        {isEmpty && (
          <Text color="gray.500" fontSize="sm">
            You haven’t created any locations yet.
          </Text>
        )}
        <Button
          leftIcon={<IoMdAdd />}
          colorScheme="brand"
          onClick={locationsModal.onOpen}
          disabled={!isEditing}
        >
          New Location
        </Button>
      </VStack>
    </>
  );
};

export default SupplierLocations;
