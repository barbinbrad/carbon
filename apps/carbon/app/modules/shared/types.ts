import type { getNotes } from "./services";

export type Note = NonNullable<
  Awaited<ReturnType<typeof getNotes>>["data"]
>[number];
