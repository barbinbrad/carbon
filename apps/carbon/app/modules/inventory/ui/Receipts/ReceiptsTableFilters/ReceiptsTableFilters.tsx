import { Select, useColor } from "@carbon/react";
import { Button, HStack } from "@chakra-ui/react";
import { Link } from "@remix-run/react";
import { IoMdAdd } from "react-icons/io";
import { DebouncedInput } from "~/components/Search";
import { usePermissions, useUrlParams } from "~/hooks";
import { receiptSourceDocumentType } from "~/modules/inventory";
import type { ListItem } from "~/types";

type ReceiptsTableFiltersProps = {
  locations: ListItem[];
};

const ReceiptsTableFilters = ({ locations }: ReceiptsTableFiltersProps) => {
  const [params, setParams] = useUrlParams();
  const permissions = usePermissions();
  const borderColor = useColor("gray.200");

  const sourceDocumentOptions = receiptSourceDocumentType.map((type) => ({
    label: type,
    value: type,
  }));

  const locationOptions = locations.map(({ id, name }) => ({
    label: name,
    value: id,
  }));

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
          value={sourceDocumentOptions.find(
            (document) => document.value === params.get("document")
          )}
          isClearable
          options={sourceDocumentOptions}
          onChange={(selected) => {
            setParams({ document: selected?.value });
          }}
          aria-label="Source Document"
          placeholder="Source Document"
          minW={180}
        />
        <Select
          // @ts-ignore
          size="sm"
          value={locationOptions.find(
            (location) => location.value === params.get("location")
          )}
          isClearable
          options={locationOptions}
          onChange={(selected) => {
            setParams({ location: selected?.value });
          }}
          aria-label="Location"
          placeholder="Location"
          minW={180}
        />
      </HStack>
      <HStack spacing={2}>
        {permissions.can("create", "inventory") && (
          <Button
            as={Link}
            to={`new?${params.toString()}`}
            colorScheme="brand"
            leftIcon={<IoMdAdd />}
          >
            New Receipt
          </Button>
        )}
      </HStack>
    </HStack>
  );
};

export default ReceiptsTableFilters;
