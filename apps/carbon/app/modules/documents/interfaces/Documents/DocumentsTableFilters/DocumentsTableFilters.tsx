import { File, Select, useColor, useNotification } from "@carbon/react";
import { HStack } from "@chakra-ui/react";
// import { useSubmit } from "@remix-run/react";
import type { ChangeEvent } from "react";
import { IoMdAdd } from "react-icons/io";
import { DebouncedInput } from "~/components/Search";
import { usePermissions, useUrlParams, useUser } from "~/hooks";
import { useSupabase } from "~/lib/supabase";

const DocumentsTableFilters = () => {
  const user = useUser();
  const { supabase } = useSupabase();
  const notification = useNotification();
  // const submit = useSubmit();
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

  const uploadFile = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && supabase) {
      const file = e.target.files[0];
      const fileUpload = await supabase.storage
        .from("private")
        .upload(`${user.id}/${file.name}`, file, {
          cacheControl: `${12 * 60 * 60}`,
          upsert: true,
        });

      if (fileUpload.error) {
        notification.copyableError(fileUpload.error, "Failed to upload file");
      }

      if (fileUpload.data?.path) {
        submitFileData(fileUpload.data.path);
      }
    }
  };

  const submitFileData = (path: string) => {
    console.log("submitFileData", path);
    // const formData = new FormData();
    // formData.append("intent", "file");
    // formData.append("name", name);
    // formData.append("userId", userId);
    // formData.append("path", path);
    // submit(formData, {
    //   method: "post",
    //   action: "/x/documents/new",
    // });
  };

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
          <File leftIcon={<IoMdAdd />} onChange={uploadFile}>
            New Document
          </File>
        )}
      </HStack>
    </HStack>
  );
};

export default DocumentsTableFilters;
