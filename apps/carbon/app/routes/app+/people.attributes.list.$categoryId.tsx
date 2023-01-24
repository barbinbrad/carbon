import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Outlet, useLoaderData, useNavigate } from "@remix-run/react";
import { useUrlParams } from "~/hooks";
import { AttributeCategoryDetail } from "~/interfaces/People/Attributes";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import {
  getAttributeCategory,
  updateAttributeSortOrder,
} from "~/services/people";
import { assertIsPost, notFound } from "~/utils/http";
import { error } from "~/utils/result";

export async function loader({ request, params }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    view: "people",
  });

  const { categoryId } = params;
  if (!categoryId || Number.isNaN(Number(categoryId)))
    throw notFound("Invalid categoryId");

  const attributeCategory = await getAttributeCategory(
    client,
    Number(categoryId)
  );
  if (attributeCategory.error) {
    return redirect(
      "/app/people/attributes",
      await flash(
        request,
        error(attributeCategory.error, "Failed to fetch attribute category")
      )
    );
  }

  return json({ attributeCategory: attributeCategory.data });
}

export async function action({ request }: ActionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    update: "people",
  });

  const updateMap = (await request.formData()).get("updates") as string;
  if (!updateMap) {
    return json(
      {},
      await flash(request, error(null, "Failed to receive a new sort order"))
    );
  }

  const updates = Object.entries(JSON.parse(updateMap)).map(
    ([idString, sortOrderString]) => ({
      id: Number(idString),
      sortOrder: Number(sortOrderString),
      updatedBy: userId,
    })
  );

  const updateSortOrders = await updateAttributeSortOrder(client, updates);
  if (updateSortOrders.some((update) => update.error))
    return json(
      {},
      await flash(
        request,
        error(updateSortOrders, "Failed to update sort order")
      )
    );

  return null;
}

export default function AttributeCategoryListRoute() {
  const { attributeCategory } = useLoaderData<typeof loader>();
  const [params] = useUrlParams();
  const navigate = useNavigate();
  const onClose = () => navigate(`/app/people/attributes?${params.toString()}`);

  return (
    <>
      <AttributeCategoryDetail
        attributeCategory={attributeCategory}
        onClose={onClose}
      />
      <Outlet />
    </>
  );
}
