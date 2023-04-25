import type { getDocuments } from "./services";

export type Document = NonNullable<
  Awaited<ReturnType<typeof getDocuments>>["data"]
>[number];
