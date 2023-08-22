import { Select, useColor } from "@carbon/react";
import { Button, HStack } from "@chakra-ui/react";
import { Link } from "@remix-run/react";
import { IoMdAdd } from "react-icons/io";
import { DebouncedInput } from "~/components/Search";
import { usePermissions, useUrlParams } from "~/hooks";
import type { CustomerStatus, CustomerType } from "~/modules/sales";
import { mapRowsToOptions } from "~/utils/form";

type CustomersTableFiltersProps = {
  customerTypes: Partial<CustomerType>[];
  customerStatuses: CustomerStatus[];
};

const CustomersTableFilters = ({
  customerTypes,
  customerStatuses,
}: CustomersTableFiltersProps) => {
  const [params, setParams] = useUrlParams();
  const permissions = usePermissions();
  const customerTypeOptions = mapRowsToOptions({
    data: customerTypes,
    value: "id",
    label: "name",
  });

  const customerStatusOptions = mapRowsToOptions({
    data: customerStatuses,
    value: (status) => status.id.toString(),
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
          placeholder="Search"
        />
        {customerTypeOptions.length > 0 && (
          <Select
            // @ts-ignore
            size="sm"
            value={customerTypeOptions.find(
              (type) => type.value === params.get("type")
            )}
            isClearable
            options={customerTypeOptions}
            onChange={(selected) => {
              setParams({ type: selected?.value });
            }}
            aria-label="Customer Type"
            placeholder="Customer Type"
            minW={180}
          />
        )}
        {customerStatusOptions && (
          <Select
            // @ts-ignore
            size="sm"
            isClearable
            value={customerStatusOptions.find(
              (type) => type.value === params.get("status")
            )}
            options={customerStatusOptions}
            onChange={(selected) => {
              setParams({ status: selected?.value });
            }}
            aria-label="Status"
            placeholder="Customer Status"
            minW={180}
          />
        )}
      </HStack>
      <HStack spacing={2}>
        {permissions.can("create", "sales") && (
          <Button
            as={Link}
            to={`new?${params.toString()}`}
            colorScheme="brand"
            leftIcon={<IoMdAdd />}
          >
            New Customer
          </Button>
        )}
      </HStack>
    </HStack>
  );
};

export default CustomersTableFilters;
