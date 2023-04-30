import { Select, useColor } from "@carbon/react";
import { HStack } from "@chakra-ui/react";
import { DebouncedInput } from "~/components/Search";
import { usePermissions, useUrlParams } from "~/hooks";
import type { DocumentLabel } from "~/modules/documents/types";
import { mapRowsToOptions } from "~/utils/form";
import DocumentCreateForm from "../DocumentCreateForm";

type DocumentTableFiltersProps = {
  labels: DocumentLabel[];
};

const DocumentsTableFilters = ({ labels }: DocumentTableFiltersProps) => {
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
      label: "Presentation",
      value: "presentation",
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
    {
      label: "Audio",
      value: "audio",
    },
  ];

  const labelOptions = mapRowsToOptions({
    data: labels,
    value: "label",
    label: "label",
  });

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
        {labels.length > 0 && (
          <Select
            // @ts-ignore
            size="sm"
            value={labelOptions.filter(
              (label) =>
                params.getAll("labels").includes(label.value as string) ||
                label.value === params.get("label")
            )}
            isClearable
            options={labelOptions}
            onChange={(selected) => {
              setParams({ label: selected?.label });
            }}
            aria-label="Label"
            minW={180}
            placeholder="Label"
          />
        )}
      </HStack>
      <HStack spacing={2}>
        {permissions.can("create", "documents") && <DocumentCreateForm />}
      </HStack>
    </HStack>
  );
};

export default DocumentsTableFilters;
