import { useColor } from "@carbon/react";
import { Button, HStack } from "@chakra-ui/react";
import { Link } from "@remix-run/react";
import { IoMdAdd } from "react-icons/io";
import { DebouncedInput } from "~/components/Search";
import { usePermissions, useUrlParams } from "~/hooks";

const PartGroupsTableFilters = () => {
  const [params] = useUrlParams();
  const permissions = usePermissions();
  const borderColor = useColor("gray.200");
  return (
    <HStack
      px={4}
      py={3}
      justifyContent="space-between"
      borderBottomColor={borderColor}
      borderBottomStyle="solid"
      borderBottomWidth={1}
      w="full"
    >
      <HStack spacing={2}>
        <DebouncedInput
          param="name"
          size="sm"
          minW={180}
          placeholder="Filter by name"
        />
      </HStack>
      <HStack spacing={2}>
        {permissions.can("create", "parts") && (
          <Button
            as={Link}
            to={`new?${params.toString()}`}
            colorScheme="brand"
            leftIcon={<IoMdAdd />}
          >
            New Part Group
          </Button>
        )}
      </HStack>
    </HStack>
  );
};

export default PartGroupsTableFilters;
