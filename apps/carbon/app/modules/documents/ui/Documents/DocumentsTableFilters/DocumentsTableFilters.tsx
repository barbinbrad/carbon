import { Select, useColor } from "@carbon/react";
import { HStack } from "@chakra-ui/react";
import { DebouncedInput } from "~/components/Search";
import { usePermissions, useUrlParams } from "~/hooks";
import type { DocumentLabel } from "~/modules/documents/types";
import { capitalize } from "~/utils/string";
import DocumentCreateForm from "../DocumentCreateForm";

type DocumentTableFiltersProps = {
  labels: DocumentLabel[];
};

const documentTypeOptions = [
  "all",
  "document",
  "presentation",
  "spreadsheet",
  "image",
  "video",
  "audio",
].map((type) => ({
  label: capitalize(type),
  value: type,
}));

const DocumentsTableFilters = ({ labels }: DocumentTableFiltersProps) => {
  const [params, setParams] = useUrlParams();
  const permissions = usePermissions();

  const borderColor = useColor("gray.200");

  const labelOptions = labels.map((l) => ({
    value: l.label,
    label: l.label,
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
          value={documentTypeOptions.find(
            (type) => type.value === params.get("type")
          )}
          isClearable
          options={documentTypeOptions}
          onChange={(selected) => {
            setParams({ type: selected?.value });
          }}
          aria-label="Document Type"
          placeholder="Document Type"
        />
        {labels.length > 0 && (
          <Select
            size="sm"
            value={labelOptions.find(
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
