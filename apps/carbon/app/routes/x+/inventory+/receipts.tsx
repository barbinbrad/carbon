import { VStack } from "@chakra-ui/react";
import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import {
  ReceiptsTable,
  ReceiptsTableFilters,
  getReceipts,
} from "~/modules/inventory";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { getGenericQueryFilters } from "~/utils/query";
import { error } from "~/utils/result";

export async function loader({ request }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    view: "inventory",
    role: "employee",
  });

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const name = searchParams.get("name");
  const type = searchParams.get("type");
  const { limit, offset, sorts } = getGenericQueryFilters(searchParams);

  const [receipts] = await Promise.all([
    getReceipts(client, {
      name,
      type,
      limit,
      offset,
      sorts,
    }),
  ]);

  if (receipts.error) {
    return redirect(
      "/x/inventory",
      await flash(request, error(null, "Error loading receipts"))
    );
  }

  return json({
    receipts: receipts.data ?? [],
    count: receipts.count ?? 0,
  });
}

export default function ReceiptsRoute() {
  const { receipts, count } = useLoaderData<typeof loader>();

  return (
    <VStack w="full" h="full" spacing={0}>
      <ReceiptsTableFilters />
      <ReceiptsTable data={receipts ?? []} count={count ?? 0} />
      <Outlet />
    </VStack>
  );
}
