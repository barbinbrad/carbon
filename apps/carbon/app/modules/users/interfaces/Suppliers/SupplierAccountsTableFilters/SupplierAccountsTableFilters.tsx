import { Select, useColor } from "@carbon/react";
import { Button, HStack } from "@chakra-ui/react";
import { Link } from "@remix-run/react";
import { IoMdAdd } from "react-icons/io";
import { DebouncedInput } from "~/components/Search";
import { usePermissions, useUrlParams } from "~/hooks";
import type { SupplierType } from "~/modules/purchasing";
import { mapRowsToOptions } from "~/utils/form";

type SupplierAccountsTableFiltersProps = {
  supplierTypes: Partial<SupplierType>[];
};

const SupplierAccountsTableFilters = ({
  supplierTypes,
}: SupplierAccountsTableFiltersProps) => {
  const [params, setParams] = useUrlParams();
  const permissions = usePermissions();
  const supplierTypeOptions = mapRowsToOptions({
    data: supplierTypes,
    value: "id",
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
          param="name"
          size="sm"
          minW={180}
          placeholder="Search by name"
        />
        <Select
          // @ts-ignore
          size="sm"
          value={supplierTypeOptions.filter(
            (type) => type.value === params.get("type")
          )}
          isClearable
          options={supplierTypeOptions}
          onChange={(selected) => {
            setParams({ type: selected?.value });
          }}
          aria-label="Supplier Type"
          minW={180}
          placeholder="Supplier Type"
        />
        <Select
          // @ts-ignore
          size="sm"
          value={
            params.get("active") === "false"
              ? { value: "false", label: "Inactive" }
              : { value: "true", label: "Active" }
          }
          options={[
            {
              value: "true",
              label: "Active",
            },
            {
              value: "false",
              label: "Inactive",
            },
          ]}
          onChange={(selected) => {
            setParams({ active: selected?.value });
          }}
          aria-label="Active"
          minW={180}
        />
      </HStack>
      <HStack spacing={2}>
        {permissions.can("create", "users") && (
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

export default SupplierAccountsTableFilters;
