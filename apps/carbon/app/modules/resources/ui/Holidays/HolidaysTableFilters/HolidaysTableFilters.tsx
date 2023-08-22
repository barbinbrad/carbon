import { Select, useColor } from "@carbon/react";
import { Button, HStack } from "@chakra-ui/react";
import { Link } from "@remix-run/react";
import { IoMdAdd } from "react-icons/io";
import { DebouncedInput } from "~/components/Search";
import { usePermissions, useUrlParams } from "~/hooks";

type HolidaysTableFiltersProps = {
  years: number[];
};

const HolidaysTableFilters = ({ years }: HolidaysTableFiltersProps) => {
  const [params, setParams] = useUrlParams();
  const permissions = usePermissions();
  const borderColor = useColor("gray.200");

  const yearsOptions = years.map((year) => ({
    label: year.toString(),
    value: year,
  }));

  return (
    <HStack
      borderBottomColor={borderColor}
      borderBottomStyle="solid"
      borderBottomWidth={1}
      justifyContent="space-between"
      px={4}
      py={3}
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
          value={
            params.get("year")
              ? yearsOptions.find(
                  (year) => year.value.toString() === params.get("year")
                )
              : {
                  label: new Date().getFullYear().toString(),
                  value: new Date().getFullYear(),
                }
          }
          options={yearsOptions}
          onChange={(selected) => {
            setParams({ year: selected?.value });
          }}
          aria-label="Year"
          minW={180}
          placeholder="Year"
        />
      </HStack>
      <HStack spacing={2}>
        {permissions.can("create", "resources") && (
          <Button
            as={Link}
            to={`new?${params.toString()}`}
            colorScheme="brand"
            leftIcon={<IoMdAdd />}
          >
            New Holiday
          </Button>
        )}
      </HStack>
    </HStack>
  );
};

export default HolidaysTableFilters;
