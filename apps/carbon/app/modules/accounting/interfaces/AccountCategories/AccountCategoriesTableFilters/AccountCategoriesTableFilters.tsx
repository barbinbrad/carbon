import { Select, useColor } from "@carbon/react";
import { Button, HStack } from "@chakra-ui/react";
import { Link } from "@remix-run/react";
import { IoMdAdd } from "react-icons/io";
import { DebouncedInput } from "~/components/Search";
import { usePermissions, useRouteData, useUrlParams } from "~/hooks";
import type {
  AccountIncomeBalance,
  AccountNormalBalance,
} from "~/modules/accounting";

const AttributeCategoriesTableFilters = () => {
  const permissions = usePermissions();
  const [params, setParams] = useUrlParams();
  const borderColor = useColor("gray.200");

  const routeData = useRouteData<{
    incomeBalances: AccountIncomeBalance[];
    normalBalances: AccountNormalBalance[];
  }>("/x/accounting/categories");

  const incomeBalanceOptions =
    routeData?.incomeBalances.map((incomeBalance) => ({
      value: incomeBalance,
      label: incomeBalance,
    })) ?? [];

  const normalBalanceOptions =
    routeData?.normalBalances.map((normalBalance) => ({
      value: normalBalance,
      label: normalBalance,
    })) ?? [];

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
          placeholder="Filter by name"
        />
        <Select
          // @ts-ignore
          size="sm"
          minW={180}
          placeholder="Income Balance"
          value={incomeBalanceOptions.filter(
            (type) => type.value === params.get("incomeBalance")
          )}
          isClearable
          options={incomeBalanceOptions}
          onChange={(selected) => {
            setParams({ incomeBalance: selected?.value });
          }}
        />
        <Select
          // @ts-ignore
          size="sm"
          minW={180}
          placeholder="Normal Balance"
          value={normalBalanceOptions.filter(
            (type) => type.value === params.get("normalBalance")
          )}
          isClearable
          options={normalBalanceOptions}
          onChange={(selected) => {
            setParams({ normalBalance: selected?.value });
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
