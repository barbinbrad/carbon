import { Select, useColor } from "@carbon/react";
import { HStack } from "@chakra-ui/react";
import { useUrlParams } from "~/hooks";
import type { ListItem } from "~/types";

type InventoryPostingGroupsFiltersProps = {
  partGroups: ListItem[];
  locations: ListItem[];
};

const InventoryPostingGroupsFilters = ({
  partGroups,
  locations,
}: InventoryPostingGroupsFiltersProps) => {
  const [params, setParams] = useUrlParams();
  const borderColor = useColor("gray.200");

  const partGroupOptions = partGroups.map((partGroup) => ({
    label: partGroup.name,
    value: partGroup.id,
  }));

  const locationOptions = locations.map((location) => ({
    label: location.name,
    value: location.id,
  }));

  return (
    <HStack
      borderBottomColor={borderColor}
      borderBottomStyle="solid"
      borderBottomWidth={1}
      justifyContent="flex-start"
      px={4}
      py={3}
      spacing={4}
      w="full"
    >
      <Select
        // @ts-ignore
        size="sm"
        isClearable
        value={partGroupOptions.find(
          (partGroup) => partGroup.value === params.get("partGroup")
        )}
        options={partGroupOptions}
        onChange={(selected) => {
          setParams({ partGroup: selected?.value });
        }}
        aria-label="Part Group"
        minW={180}
        placeholder="Part Group"
      />
      <Select
        // @ts-ignore
        size="sm"
        isClearable
        value={locationOptions.find(
          (location) => location.value === params.get("location")
        )}
        options={locationOptions}
        onChange={(selected) => {
          setParams({ location: selected?.value });
        }}
        aria-label="Location"
        minW={180}
        placeholder="Location"
      />
    </HStack>
  );
};

export default InventoryPostingGroupsFilters;
