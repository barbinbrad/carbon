import type { getSequences } from "./services";

export type Sequence = NonNullable<
  Awaited<ReturnType<typeof getSequences>>["data"]
>[number];
