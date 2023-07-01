import { useNotification } from "@carbon/react";
import { useFetcher } from "@remix-run/react";
import { useCallback } from "react";
import { usePermissions } from "~/hooks";
import { useSupabase } from "~/lib/supabase";
import type { PurchaseOrderAttachment } from "~/modules/purchasing/types";

type Props = {
  isExternal: boolean;
  orderId: string;
};

export const usePurchaseOrderDocuments = ({ isExternal, orderId }: Props) => {
  const notification = useNotification();
  const fetcher = useFetcher();
  const permissions = usePermissions();
  const { supabase } = useSupabase();

  const canDelete = permissions.can("delete", "purchasing");

  const refresh = useCallback(
    () => fetcher.submit(null, { method: "post" }),
    [fetcher]
  );

  const deleteAttachment = useCallback(
    async (attachment: PurchaseOrderAttachment) => {
      const result = await supabase?.storage
        .from(isExternal ? "purchasing-external" : "purchasing-internal")
        .remove([`${orderId}/${attachment.name}`]);

      if (!result || result.error) {
        notification.error(result?.error?.message || "Error deleting file");
        return;
      }

      notification.success("File deleted successfully");
      refresh();
    },
    [supabase, notification, orderId, isExternal, refresh]
  );

  const download = useCallback(
    async (attachment: PurchaseOrderAttachment) => {
      const result = await supabase?.storage
        .from(isExternal ? "purchasing-external" : "purchasing-internal")
        .download(`${orderId}/${attachment.name}`);

      if (!result || result.error) {
        notification.error(result?.error?.message || "Error downloading file");
        return;
      }

      const a = document.createElement("a");
      document.body.appendChild(a);
      const url = window.URL.createObjectURL(result.data);
      a.href = url;
      a.download = attachment.name;
      a.click();

      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 0);
    },
    [supabase, notification, orderId, isExternal]
  );

  const isImage = useCallback((fileType: string) => {
    return ["png", "jpg", "jpeg", "gif", "svg", "avif"].includes(fileType);
  }, []);

  const makePreview = useCallback(
    async (attachment: PurchaseOrderAttachment) => {
      const result = await supabase?.storage
        .from(isExternal ? "purchasing-external" : "purchasing-internal")
        .download(`${orderId}/${attachment.name}`);

      if (!result || result.error) {
        notification.error(result?.error?.message || "Error previewing file");
        return null;
      }

      return window.URL.createObjectURL(result.data);
    },
    [isExternal, notification, orderId, supabase?.storage]
  );

  return {
    canDelete,
    deleteAttachment,
    download,
    isImage,
    makePreview,
  };
};
