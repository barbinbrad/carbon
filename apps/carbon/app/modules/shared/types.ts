import type { getNotes } from "./shared.service";

export type Note = NonNullable<
  Awaited<ReturnType<typeof getNotes>>["data"]
>[number];
