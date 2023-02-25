import { Select, useColor } from "@carbon/react";
import { Button, HStack } from "@chakra-ui/react";
import { Link } from "@remix-run/react";
import { IoMdAdd } from "react-icons/io";
import { DebouncedInput } from "~/components/Search";
import { usePermissions, useUrlParams } from "~/hooks";
import type { ShiftLocation } from "~/interfaces/Resources/types";
import { mapRowsToOptions } from "~/utils/form";

type ShiftsTableFiltersProps = {
  locations: Partial<ShiftLocation>[];
};

const ShiftsTableFilters = ({ locations }: ShiftsTableFiltersProps) => {
  const [params, setParams] = useUrlParams();
  const permissions = usePermissions();
  const borderColor = useColor("gray.200");
  const locationOptions = mapRowsToOptions({
    data: locations,
    value: "id",
    label: "name",
  });
  return (
    <HStack
      borderBottomColor={borderColor}
      borderBottomStyle="solid"
      borderBottomWidth={1}
      justifyContent="space-between"
      px={4}
      py={3}
      w="full"
    >
      <HStack spacing={2}>
        <DebouncedInput
          param="name"
          size="sm"
          minW={180}
          placeholder="Search by name"
        />
        <Select
          // @ts-ignore
          size="sm"
          value={locationOptions.filter(
            (type) => type.value === params.get("location")
          )}
          isClearable
          options={locationOptions}
          onChange={(selected) => {
            setParams({ location: selected?.value });
          }}
          aria-label="Location"
          minW={180}
          placeholder="Location"
        />
      </HStack>
      <HStack spacing={2}>
        {permissions.can("create", "resources") && (
          <Button
            as={Link}
            to={`new?${params.toString()}`}
            colorScheme="brand"
            leftIcon={<IoMdAdd />}
          >
            New Shift
          </Button>
        )}
      </HStack>
    </HStack>
  );
};

export default ShiftsTableFilters;
