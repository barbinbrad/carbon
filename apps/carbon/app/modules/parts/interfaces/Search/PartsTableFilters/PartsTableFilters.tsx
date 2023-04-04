import { Select, useColor } from "@carbon/react";
import { Button, HStack } from "@chakra-ui/react";
import { Link } from "@remix-run/react";
import { IoMdAdd } from "react-icons/io";
import { DebouncedInput } from "~/components/Search";
import { usePermissions, useUrlParams } from "~/hooks";
import type { PartGroup, PartType } from "~/modules/parts";
import { mapRowsToOptions } from "~/utils/form";

type PartsTableFiltersProps = {
  partTypes: PartType[];
  partGroups: PartGroup[];
};

const PartsTableFilters = ({
  partTypes,
  partGroups,
}: PartsTableFiltersProps) => {
  const [params, setParams] = useUrlParams();
  const permissions = usePermissions();
  const partTypeOptions = partTypes.map((type) => ({
    value: type,
    label: type,
  }));

  const partGroupsOptions = mapRowsToOptions({
    data: partGroups,
    value: (group) => group.id.toString(),
    label: "name",
  });

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
          param="id"
          size="sm"
          minW={180}
          placeholder="Filter by id"
        />
        {partGroupsOptions && (
          <Select
            // @ts-ignore
            size="sm"
            isClearable
            value={partGroupsOptions.filter(
              (type) => type.value === params.get("group")
            )}
            options={partGroupsOptions}
            onChange={(selected) => {
              setParams({ group: selected?.value });
            }}
            aria-label="Groups"
            placeholder="Part Groups"
            minW={180}
          />
        )}
        {partTypeOptions.length > 0 && (
          <Select
            // @ts-ignore
            size="sm"
            value={partTypeOptions.filter(
              (type) => type.value === params.get("type")
            )}
            isClearable
            options={partTypeOptions}
            onChange={(selected) => {
              setParams({ type: selected?.value });
            }}
            aria-label="Part Type"
            placeholder="Part Type"
            minW={180}
          />
        )}
      </HStack>
      <HStack spacing={2}>
        {permissions.can("create", "parts") && (
          <Button
            as={Link}
            to={`../new?${params.toString()}`}
            colorScheme="brand"
            leftIcon={<IoMdAdd />}
          >
            New Part
          </Button>
        )}
      </HStack>
    </HStack>
  );
};

export default PartsTableFilters;
