import { Select, useColor } from "@carbon/react";
import { Button, HStack, Link } from "@chakra-ui/react";
import { IoMdAdd } from "react-icons/io";
import { DebouncedInput } from "~/components/Search";
import { usePermissions, useUrlParams } from "~/hooks";

const purchaseOrderStatusOptions = [
  "Draft",
  "In Review",
  "In External Review",
  "Approved",
  "Rejected",
  "Confirmed",
].map((type) => ({
  label: type,
  value: type,
}));

const PurchaseOrdersTableFilters = () => {
  const [params, setParams] = useUrlParams();
  const permissions = usePermissions();

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
          param="search"
          size="sm"
          minW={180}
          placeholder="Search"
        />
        <Select
          // @ts-ignore
          size="sm"
          value={purchaseOrderStatusOptions.filter(
            (type) => type.value === params.get("status")
          )}
          isClearable
          options={purchaseOrderStatusOptions}
          onChange={(selected) => {
            setParams({ status: selected?.value });
          }}
          aria-label="Status"
          minW={180}
          placeholder="Status"
        />
      </HStack>
      <HStack spacing={2}>
        {permissions.can("create", "purchasing") && (
          <Button
            as={Link}
            to={`new?${params.toString()}`}
            colorScheme="brand"
            leftIcon={<IoMdAdd />}
          >
            New Purchase Order
          </Button>
        )}
      </HStack>
    </HStack>
  );
};

export default PurchaseOrdersTableFilters;
