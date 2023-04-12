import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import { useRouteData } from "~/hooks";
import { PartGroupForm } from "~/modules/parts";
import {
  partGroupValidator,
  getPartGroup,
  upsertPartGroup,
} from "~/modules/parts";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { assertIsPost, notFound } from "~/utils/http";
import { error, success } from "~/utils/result";

export async function loader({ request, params }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    view: "parts",
    role: "employee",
  });

  const { groupId } = params;
  if (!groupId) throw notFound("groupId not found");

  const partGroup = await getPartGroup(client, groupId);

  return json({
    partGroup: partGroup?.data ?? null,
  });
}

export async function action({ request }: ActionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    update: "parts",
  });

  const validation = await partGroupValidator.validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const {
    id,
    name,
    description,
    salesAccountId,
    discountAccountId,
    inventoryAccountId,
  } = validation.data;

  const updatePartGroup = await upsertPartGroup(client, {
    id,
    name,
    description,
    salesAccountId,
    discountAccountId,
    inventoryAccountId,
    updatedBy: userId,
  });

  if (updatePartGroup.error) {
    return json(
      {},
      await flash(
        request,
        error(updatePartGroup.error, "Failed to update part group")
      )
    );
  }

  return redirect(
    "/x/parts/groups",
    await flash(request, success("Updated part group"))
  );
}

export default function EditPartGroupsRoute() {
  const { partGroup } = useLoaderData<typeof loader>();
  const routeData = useRouteData<{
    accounts: { name: string; number: string }[];
  }>("/x/parts/groups");

  const initialValues = {
    id: partGroup?.id ?? undefined,
    name: partGroup?.name ?? "",
    description: partGroup?.description ?? "",
    salesAccountId: partGroup?.salesAccountId ?? "",
    discountAccountId: partGroup?.discountAccountId ?? "",
    inventoryAccountId: partGroup?.inventoryAccountId ?? "",
  };

  return (
    <PartGroupForm
      accounts={routeData?.accounts ?? []}
      initialValues={initialValues}
    />
  );
}
