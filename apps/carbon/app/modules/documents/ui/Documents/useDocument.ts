import { useNotification } from "@carbon/react";
import { useNavigate } from "@remix-run/react";
import { useCallback } from "react";
import { usePermissions, useUrlParams, useUser } from "~/hooks";
import { useSupabase } from "~/lib/supabase";
import type { Document, DocumentTransactionType } from "~/modules/documents";
import { path } from "~/utils/path";

export const useDocument = () => {
  const navigate = useNavigate();
  const notification = useNotification();
  const permissions = usePermissions();
  const { supabase } = useSupabase();
  const [params, setParams] = useUrlParams();
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

  const insertTransaction = useCallback(
    (document: Document, type: DocumentTransactionType) => {
      if (user?.id === undefined) throw new Error("User is undefined");
      return supabase?.from("documentTransaction").insert({
        documentId: document.id,
        type,
        userId: user.id,
      });
    },
    [supabase, user?.id]
  );

  const deleteLabel = useCallback(
    async (document: Document, label: string) => {
      return supabase
        ?.from("documentLabel")
        .delete()
        .eq("documentId", document.id)
        .eq("userId", user?.id)
        .eq("label", label);
    },
    [supabase, user?.id]
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

      await insertTransaction(doc, "Download");
    },
    [supabase, notification, insertTransaction]
  );

  const edit = useCallback(
    (document: Document) =>
      navigate(`${path.to.document(document.id)}?${params}`),
    [navigate, params]
  );

  const favorite = useCallback(
    async (document: Document) => {
      if (document.favorite) {
        await supabase
          ?.from("documentFavorite")
          .delete()
          .eq("documentId", document.id)
          .eq("userId", user?.id);
        return insertTransaction(document, "Unfavorite");
      } else {
        await supabase
          ?.from("documentFavorite")
          .insert({ documentId: document.id, userId: user?.id });
        return insertTransaction(document, "Favorite");
      }
    },
    [insertTransaction, supabase, user?.id]
  );

  const isImage = useCallback((fileType: string) => {
    return ["png", "jpg", "jpeg", "gif", "svg", "avif"].includes(fileType);
  }, []);

  const label = useCallback(
    async (document: Document, labels: string[]) => {
      if (user?.id === undefined) throw new Error("User is undefined");
      await supabase
        ?.from("documentLabel")
        .delete()
        .eq("documentId", document.id)
        .eq("userId", user.id)
        .then(() => {
          return supabase?.from("documentLabel").insert(
            labels.map((label) => ({
              documentId: document.id,
              label,
              userId: user.id,
            }))
          );
        });

      return insertTransaction(document, "Label");
    },
    [insertTransaction, supabase, user.id]
  );

  const makePreview = useCallback(
    async (doc: Document) => {
      const result = await supabase?.storage.from("private").download(doc.path);

      if (!result || result.error) {
        notification.error(result?.error?.message || "Error previewing file");
        return null;
      }

      return window.URL.createObjectURL(result.data);
    },
    [notification, supabase]
  );

  const removeLabel = useCallback(
    (document: Document, label: string) => {
      return supabase
        ?.from("documentLabel")
        .delete()
        .eq("documentId", document.id)
        .eq("userId", user?.id)
        .eq("label", label);
    },
    [supabase, user?.id]
  );

  const setLabel = useCallback(
    (label: string) => {
      setParams({ label });
    },
    [setParams]
  );

  return {
    canDelete,
    canUpdate,
    download,
    deleteLabel,
    edit,
    favorite,
    isImage,
    label,
    makePreview,
    removeLabel,
    setLabel,
  };
};
