import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useNavigate, useParams } from "@remix-run/react";
import { useRouteData } from "~/hooks";
import { AttributeForm } from "~/interfaces/People/Attributes";
import type { AttributeDataType } from "~/interfaces/People/types";
import { requirePermissions } from "~/services/auth";
import { getAttribute } from "~/services/people";
import { flash } from "~/services/session";
import { notFound } from "~/utils/http";
import { error } from "~/utils/result";

export async function loader({ request, params }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    view: "people",
    role: "employee",
  });

  const { categoryId, attributeId } = params;
  if (!attributeId || Number.isNaN(Number(attributeId)))
    throw notFound("attributeId not found");

  const attribute = await getAttribute(client, Number(attributeId));
  if (attribute.error) {
    return redirect(
      `/x/people/attributes/list/${categoryId}`,
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
  const onClose = () => navigate(`/x/people/attributes/list/${categoryId}`);
  const attributesRouteData = useRouteData<{
    dataTypes: {
      data: AttributeDataType[] | null;
    };
  }>("/x/people/attributes");

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
