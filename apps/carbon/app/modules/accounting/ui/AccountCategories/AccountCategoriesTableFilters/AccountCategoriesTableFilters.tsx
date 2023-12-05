import { Select, useColor } from "@carbon/react";
import { Button, HStack } from "@chakra-ui/react";
import { Link } from "@remix-run/react";
import { IoMdAdd } from "react-icons/io";
import { DebouncedInput } from "~/components/Search";
import { usePermissions, useUrlParams } from "~/hooks";
import { accountClassTypes, incomeBalanceTypes } from "~/modules/accounting";

const AttributeCategoriesTableFilters = () => {
  const permissions = usePermissions();
  const [params, setParams] = useUrlParams();
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
          size="sm"
          placeholder="Income Balance"
          value={incomeBalanceTypes
            .map((incomeBalance) => ({
              value: incomeBalance,
              label: incomeBalance,
            }))
            .filter((type) => type.value === params.get("incomeBalance"))}
          isClearable
          options={incomeBalanceTypes.map((incomeBalance) => ({
            value: incomeBalance,
            label: incomeBalance,
          }))}
          onChange={(selected) => {
            setParams({ incomeBalance: selected?.value });
          }}
        />
        <Select
          size="sm"
          placeholder="Normal Balance"
          value={accountClassTypes
            .map((accountClass) => ({
              value: accountClass,
              label: accountClass,
            }))
            .filter((type) => type.value === params.get("accountClass"))}
          isClearable
          options={accountClassTypes.map((accountClass) => ({
            value: accountClass,
            label: accountClass,
          }))}
          onChange={(selected) => {
            setParams({ accountClass: selected?.value });
          }}
        />
      </HStack>
      <HStack spacing={2}>
        {permissions.can("update", "resources") && (
          <Button
            as={Link}
            to={`new?${params.toString()}`}
            colorScheme="brand"
            leftIcon={<IoMdAdd />}
          >
            New Account Category
          </Button>
        )}
      </HStack>
    </HStack>
  );
};

export default AttributeCategoriesTableFilters;
