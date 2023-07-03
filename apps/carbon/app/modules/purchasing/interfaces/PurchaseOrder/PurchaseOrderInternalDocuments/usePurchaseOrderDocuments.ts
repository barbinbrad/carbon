import { useNotification } from "@carbon/react";
import { useFetcher } from "@remix-run/react";
import { useCallback } from "react";
import { usePermissions } from "~/hooks";
import { useSupabase } from "~/lib/supabase";
import type { PurchaseOrderAttachment } from "~/modules/purchasing/types";

type Props = {
  attachments: PurchaseOrderAttachment[];
  isExternal: boolean;
  orderId: string;
};

export const usePurchaseOrderDocuments = ({
  attachments,
  isExternal,
  orderId,
}: Props) => {
  const notification = useNotification();
  const fetcher = useFetcher();
  const permissions = usePermissions();
  const { supabase } = useSupabase();

  // const [users, setUsers] = useState<
  //   {
  //     id: string;
  //     firstName: string | null;
  //     lastName: string | null;
  //     avatarUrl: string | null;
  //   }[]
  // >([]);

  const canDelete = permissions.can("delete", "purchasing"); // TODO: or is document owner

  const refresh = useCallback(
    () => fetcher.submit(null, { method: "post" }),
    [fetcher]
  );

  // const getUsers = useCallback(async () => {
  //   const userIds = [
  //     ...new Set(attachments.map((attachment) => attachment.owner)),
  //   ];

  //   if (!supabase) return {};

  //   const { data, error } = await supabase
  //     .from("users")
  //     .select("*")
  //     .in("id", userIds);

  //   if (error) {
  //     setUsers([]);
  //   } else {
  //     console.log(data);
  //     setUsers(data);
  //   }
  // }, [attachments, supabase]);

  // useEffect(() => {
  //   getUsers();
  // }, [getUsers]);

  // const usersMap = useMemo<
  //   Record<string, { fullName: string; avatarUrl: string | null }>
  // >(() => {
  //   return users.reduce<
  //     Record<string, { fullName: string; avatarUrl: string | null }>
  //   >((acc, user) => {
  //     acc[user.id] = {
  //       fullName: `${user.firstName} ${user.lastName}`,
  //       avatarUrl: user.avatarUrl,
  //     };
  //     return acc;
  //   }, {});
  // }, [users]);

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

  // const getAvatarPath = useCallback(
  //   (userId: string) => {
  //     return usersMap[userId]?.avatarUrl;
  //   },
  //   [usersMap]
  // );

  // const getFullName = useCallback(
  //   (userId: string) => {
  //     return usersMap[userId]?.fullName;
  //   },
  //   [usersMap]
  // );

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
    // getAvatarPath,
    // getFullName,
    isImage,
    makePreview,
  };
};
