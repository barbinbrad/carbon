import { useNotification } from "@carbon/react";
import { useNavigate } from "@remix-run/react";
import { useCallback } from "react";
import { usePermissions, useUrlParams, useUser } from "~/hooks";
import { useSupabase } from "~/lib/supabase";
import type { Document } from "~/modules/documents";

export const useDocument = () => {
  const navigate = useNavigate();
  const notification = useNotification();
  const permissions = usePermissions();
  const { supabase } = useSupabase();
  const [params] = useUrlParams();
  const user = useUser();

  const canDelete = useCallback(
    (document: Document) => {
      return (
        !permissions.can("delete", "documents") ||
        !document.writeGroups?.some((group) => user?.groups.includes(group))
      );
    },
    [permissions, user]
  );

  const canUpdate = useCallback(
    (document: Document) => {
      return (
        !permissions.can("update", "documents") ||
        !document.writeGroups?.some((group) => user?.groups.includes(group))
      );
    },
    [permissions, user]
  );

  const download = useCallback(
    async (doc: Document) => {
      const result = await supabase?.storage.from("private").download(doc.path);

      if (!result || result.error) {
        notification.error(result?.error?.message || "Error downloading file");
        return;
      }

      const a = document.createElement("a");
      document.body.appendChild(a);
      const url = window.URL.createObjectURL(result.data);
      a.href = url;
      a.download = doc.name;
      a.click();

      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 0);
    },
    [supabase, notification]
  );

  const edit = useCallback(
    (document: Document) =>
      navigate(`/x/documents/search/${document.id}/edit?${params}`),
    [navigate, params]
  );

  const preview = useCallback(
    (document: Document) =>
      navigate(`/x/documents/search/${document.id}/preview?${params}`),
    [navigate, params]
  );

  return {
    canDelete,
    canUpdate,
    download,
    edit,
    preview,
  };
};
