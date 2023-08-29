import { Select, useColor } from "@carbon/react";
import { HStack } from "@chakra-ui/react";
import { useUrlParams } from "~/hooks";
import type { ListItem } from "~/types";

type PurchasingPostingGroupsFiltersProps = {
  partGroups: ListItem[];
  supplierTypes: ListItem[];
};

const PurchasingPostingGroupsFilters = ({
  partGroups,
  supplierTypes,
}: PurchasingPostingGroupsFiltersProps) => {
  const [params, setParams] = useUrlParams();
  const borderColor = useColor("gray.200");

  const partGroupOptions = partGroups.map((partGroup) => ({
    label: partGroup.name,
    value: partGroup.id,
  }));

  const supplierTypeOptions = supplierTypes.map((supplierType) => ({
    label: supplierType.name,
    value: supplierType.id,
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
        value={supplierTypeOptions.find(
          (supplierType) => supplierType.value === params.get("supplierType")
        )}
        options={supplierTypeOptions}
        onChange={(selected) => {
          setParams({ supplierType: selected?.value });
        }}
        aria-label="Supplier Type"
        minW={180}
        placeholder="Supplier Type"
      />
    </HStack>
  );
};

export default PurchasingPostingGroupsFilters;
