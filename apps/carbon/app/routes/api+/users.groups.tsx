import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { arrayToTree } from "performant-array-to-tree";
import type { Group } from "~/modules/users";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { error } from "~/utils/result";

export async function loader({ request }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    role: "employee",
  });

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const type = searchParams.get("type");

  const query = client.from("groups_view").select("*");

  if (type === "employee") query.eq("isEmployeeTypeGroup", true);
  if (type === "customer") query.eq("isCustomerOrgGroup", true);
  if (type === "supplier") query.eq("isSupplierOrgGroup", true);

  const groups = await query;

  if (groups.error) {
    return json(
      { groups: [], error: groups.error },
      await flash(request, error(groups.error, "Failed to load groups"))
    );
  }

  return json({
    groups: arrayToTree(groups.data) as Group[],
  });
}
