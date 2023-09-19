import { Select, useColor } from "@carbon/react";
import { HStack } from "@chakra-ui/react";
import { useUrlParams } from "~/hooks";
import type { ListItem } from "~/types";

type SalesPostingGroupsFiltersProps = {
  partGroups: ListItem[];
  customerTypes: ListItem[];
};

const SalesPostingGroupsFilters = ({
  partGroups,
  customerTypes,
}: SalesPostingGroupsFiltersProps) => {
  const [params, setParams] = useUrlParams();
  const borderColor = useColor("gray.200");

  const partGroupOptions = partGroups.map((partGroup) => ({
    label: partGroup.name,
    value: partGroup.id,
  }));

  const customerTypeOptions = customerTypes.map((customerType) => ({
    label: customerType.name,
    value: customerType.id,
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
        placeholder="Part Group"
      />
      <Select
        size="sm"
        isClearable
        value={customerTypeOptions.find(
          (customerType) => customerType.value === params.get("customerType")
        )}
        options={customerTypeOptions}
        onChange={(selected) => {
          setParams({ customerType: selected?.value });
        }}
        aria-label="Customer Type"
        placeholder="Customer Type"
      />
    </HStack>
  );
};

export default SalesPostingGroupsFilters;
