import type { getAccountById } from "~/services/account";

export type PersonalData = {};

export type Account = NonNullable<
  Awaited<ReturnType<typeof getAccountById>>["data"]
>;
