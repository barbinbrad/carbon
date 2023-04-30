import type { getDocumentLabels, getDocuments } from "./services";

export type Document = NonNullable<
  Awaited<ReturnType<typeof getDocuments>>["data"]
>[number];

export type DocumentLabel = NonNullable<
  Awaited<ReturnType<typeof getDocumentLabels>>["data"]
>[number];
