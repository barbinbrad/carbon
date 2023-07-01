import { File, useNotification } from "@carbon/react";
import { useFetcher } from "@remix-run/react";
import type { ChangeEvent } from "react";
import { IoMdAdd } from "react-icons/io";
import { useSupabase } from "~/lib/supabase";

type PurchaseOrderDocumentFormProps = {
  orderId: string;
  isExternal: boolean;
};

const PurchaseOrderDocumentForm = ({
  orderId,
  isExternal,
}: PurchaseOrderDocumentFormProps) => {
  const fetcher = useFetcher();
  const notification = useNotification();
  const { supabase } = useSupabase();

  const uploadFile = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && supabase) {
      const file = e.target.files[0];
      const fileName = `${orderId}/${file.name}`;

      const fileUpload = await supabase.storage
        .from(`purchasing-${isExternal ? "external" : "internal"}`)
        .upload(fileName, file, {
          cacheControl: `${12 * 60 * 60}`,
        });

      if (fileUpload.error) {
        notification.copyableError(fileUpload.error, "Failed to upload file");
      }

      if (fileUpload.data?.path) {
        notification.success("File uploaded");
        // refetch the loaders
        fetcher.submit(null, { method: "post" });
      }
    }
  };

  return (
    <File leftIcon={<IoMdAdd />} onChange={uploadFile}>
      New
    </File>
  );
};

export default PurchaseOrderDocumentForm;
