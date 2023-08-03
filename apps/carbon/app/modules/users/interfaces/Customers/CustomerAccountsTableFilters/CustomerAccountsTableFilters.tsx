import { Select, useColor } from "@carbon/react";
import { Button, HStack } from "@chakra-ui/react";
import { Link } from "@remix-run/react";
import { IoMdAdd } from "react-icons/io";
import { DebouncedInput } from "~/components/Search";
import { usePermissions, useUrlParams } from "~/hooks";
import type { CustomerType } from "~/modules/sales";
import { mapRowsToOptions } from "~/utils/form";

type CustomerAccountsTableFiltersProps = {
  customerTypes: Partial<CustomerType>[];
};

const CustomerAccountsTableFilters = ({
  customerTypes,
}: CustomerAccountsTableFiltersProps) => {
  const [params, setParams] = useUrlParams();
  const permissions = usePermissions();
  const customerTypeOptions = mapRowsToOptions({
    data: customerTypes,
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
          placeholder="Search"
        />
        <Select
          // @ts-ignore
          size="sm"
          value={customerTypeOptions.filter(
            (type) => type.value === params.get("type")
          )}
          isClearable
          options={customerTypeOptions}
          onChange={(selected) => {
            setParams({ type: selected?.value });
          }}
          aria-label="Customer Type"
          minW={180}
          placeholder="Customer Type"
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
            New Customer
          </Button>
        )}
      </HStack>
    </HStack>
  );
};

export default CustomerAccountsTableFilters;
