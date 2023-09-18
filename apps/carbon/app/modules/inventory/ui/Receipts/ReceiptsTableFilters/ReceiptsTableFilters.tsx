import { Select, useColor } from "@carbon/react";
import { Button, HStack } from "@chakra-ui/react";
import { Link } from "@remix-run/react";
import { IoMdAdd } from "react-icons/io";
import { DebouncedInput } from "~/components/Search";
import { usePermissions, useUrlParams, useUser } from "~/hooks";
import { receiptSourceDocumentType } from "~/modules/inventory";
import type { ListItem } from "~/types";

type ReceiptsTableFiltersProps = {
  locations: ListItem[];
};

const ReceiptsTableFilters = ({ locations }: ReceiptsTableFiltersProps) => {
  const [params, setParams] = useUrlParams();
  const permissions = usePermissions();
  const borderColor = useColor("gray.200");
  const {
    defaults: { locationId },
  } = useUser();

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
        />
        <Select
          size="sm"
          value={
            params.get("location")
              ? locationOptions.find(
                  (location) => location.value === params.get("location")
                )
              : locationOptions.find(
                  (location) => location.value === locationId
                )
          }
          options={locationOptions}
          onChange={(selected) => {
            setParams({ location: selected?.value });
          }}
          aria-label="Location"
          placeholder="Location"
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
