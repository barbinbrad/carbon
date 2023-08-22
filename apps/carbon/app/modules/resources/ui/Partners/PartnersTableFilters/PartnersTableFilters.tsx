import { Select, useColor } from "@carbon/react";
import { Button, HStack } from "@chakra-ui/react";
import { Link } from "@remix-run/react";
import { IoMdAdd } from "react-icons/io";
import { DebouncedInput } from "~/components/Search";
import { usePermissions, useUrlParams } from "~/hooks";
import type { Ability } from "~/modules/resources/types";
import { mapRowsToOptions } from "~/utils/form";

type PartnersTableFiltersProps = {
  abilities: Partial<Ability>[];
};

const PartnersTableFilters = ({ abilities }: PartnersTableFiltersProps) => {
  const [params, setParams] = useUrlParams();
  const permissions = usePermissions();
  const abilitiesOptions = mapRowsToOptions({
    data: abilities,
    value: "id",
    label: "name",
  });
  const borderColor = useColor("gray.200");

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
          value={abilitiesOptions.find(
            (type) => type.value === params.get("ability")
          )}
          isClearable
          options={abilitiesOptions}
          onChange={(selected) => {
            setParams({ ability: selected?.value });
          }}
          aria-label="Ability"
          minW={180}
          placeholder="Ability"
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
            New Partner
          </Button>
        )}
      </HStack>
    </HStack>
  );
};

export default PartnersTableFilters;
