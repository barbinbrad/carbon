import { Select, useColor } from "@carbon/react";
import { Button, HStack } from "@chakra-ui/react";
import { Link } from "@remix-run/react";
import { IoMdAdd } from "react-icons/io";
import { DebouncedInput } from "~/components/Search";
import { usePermissions, useUrlParams } from "~/hooks";
import type { SupplierStatus, SupplierType } from "~/modules/purchasing";

type SuppliersTableFiltersProps = {
  supplierTypes: Partial<SupplierType>[];
  supplierStatuses: SupplierStatus[];
};

const SuppliersTableFilters = ({
  supplierTypes,
  supplierStatuses,
}: SuppliersTableFiltersProps) => {
  const [params, setParams] = useUrlParams();
  const permissions = usePermissions();

  const supplierTypeOptions =
    supplierTypes?.map((type) => ({
      value: type.id,
      label: type.name,
    })) ?? [];

  const supplierStatusOptions =
    supplierStatuses?.map((status) => ({
      value: status.id.toString(),
      label: status.name,
    })) ?? [];

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
          placeholder="Search"
        />
        {supplierTypeOptions.length > 0 && (
          <Select
            size="sm"
            value={supplierTypeOptions.find(
              (type) => type.value === params.get("type")
            )}
            isClearable
            options={supplierTypeOptions}
            onChange={(selected) => {
              setParams({ type: selected?.value });
            }}
            aria-label="Supplier Type"
            placeholder="Supplier Type"
          />
        )}
        {supplierStatusOptions && (
          <Select
            size="sm"
            isClearable
            value={supplierStatusOptions.find(
              (type) => type.value === params.get("status")
            )}
            options={supplierStatusOptions}
            onChange={(selected) => {
              setParams({ status: selected?.value });
            }}
            aria-label="Status"
            placeholder="Supplier Status"
          />
        )}
      </HStack>
      <HStack spacing={2}>
        {permissions.can("create", "purchasing") && (
          <Button
            as={Link}
            to={`new?${params.toString()}`}
            colorScheme="brand"
            leftIcon={<IoMdAdd />}
          >
            New Supplier
          </Button>
        )}
      </HStack>
    </HStack>
  );
};

export default SuppliersTableFilters;
