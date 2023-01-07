import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useNavigate, useParams } from "@remix-run/react";
import { useRouteData } from "~/hooks";
import { AttributeForm } from "~/interfaces/Users/Attributes";
import type { AttributeDataType } from "~/interfaces/Users/types";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { getAttribute } from "~/services/users";
import { notFound } from "~/utils/http";
import { error } from "~/utils/result";

export async function loader({ request, params }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    view: "users",
  });

  const { categoryId, attributeId } = params;
  if (!attributeId || Number.isNaN(Number(attributeId)))
    throw notFound("attributeId not found");

  const attribute = await getAttribute(client, Number(attributeId));
  if (attribute.error) {
    return redirect(
      `/app/users/attributes/list/${categoryId}`,
      await flash(request, error(attribute.error, "Failed to fetch attribute"))
    );
  }

  return json({
    attribute: attribute.data,
  });
}

export default function EditAttributeRoute() {
  const { attribute } = useLoaderData<typeof loader>();
  const { categoryId } = useParams();
  if (Number.isNaN(categoryId)) throw new Error("categoryId is not a number");

  const navigate = useNavigate();
  const onClose = () => navigate(`/app/users/attributes/list/${categoryId}`);
  const attributesRouteData = useRouteData<{
    dataTypes: {
      data: AttributeDataType[] | null;
    };
  }>("/app/users/attributes");

  return (
    <AttributeForm
      initialValues={{
        id: attribute?.id,
        name: attribute?.name,
        attributeDataTypeId: attribute?.attributeDataTypeId,
        userAttributeCategoryId: attribute?.userAttributeCategoryId,
        canSelfManage: attribute.canSelfManage ?? true,
        listOptions: attribute?.listOptions ?? [],
      }}
      dataTypes={attributesRouteData?.dataTypes?.data ?? []}
      onClose={onClose}
    />
  );
}
