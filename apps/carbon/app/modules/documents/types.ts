import type { Database } from "@carbon/database";
import type { getDocumentLabels } from "./services";

export type Document = Omit<
  Database["public"]["Tables"]["document"]["Row"],
  "createdBy" | "updatedBy"
> & {
  favorite: boolean;
  labels: string[];
  createdByAvatar: string;
  createdByFullName: string;
  updatedByAvatar?: string | null;
  updatedByFullName?: string | null;
};

export type DocumentLabel = NonNullable<
  Awaited<ReturnType<typeof getDocumentLabels>>["data"]
>[number];
