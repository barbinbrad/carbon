import { Select, useColor } from "@carbon/react";
import { Button, HStack } from "@chakra-ui/react";
import { Link } from "@remix-run/react";
import { IoMdAdd } from "react-icons/io";
import { DebouncedInput } from "~/components/Search";
import { usePermissions, useUrlParams } from "~/hooks";

const DocumentsTableFilters = () => {
  const [params, setParams] = useUrlParams();
  const permissions = usePermissions();

  const borderColor = useColor("gray.200");
  const documentTypeOptions = [
    {
      label: "All",
      value: "all",
    },
    {
      label: "Document",
      value: "document",
    },
    {
      label: "Spreadsheet",
      value: "spreadsheet",
    },
    {
      label: "Image",
      value: "image",
    },
    {
      label: "Video",
      value: "video",
    },
  ];

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
          value={documentTypeOptions.filter(
            (type) => type.value === params.get("type")
          )}
          isClearable
          options={documentTypeOptions}
          onChange={(selected) => {
            setParams({ type: selected?.value });
          }}
          aria-label="Document Type"
          minW={180}
          placeholder="Document Type"
        />
      </HStack>
      <HStack spacing={2}>
        {permissions.can("create", "documents") && (
          <Button
            as={Link}
            to={`new?${params.toString()}`}
            colorScheme="brand"
            leftIcon={<IoMdAdd />}
          >
            New Document
          </Button>
        )}
      </HStack>
    </HStack>
  );
};

export default DocumentsTableFilters;
