import { useNavigate, useParams } from "@remix-run/react";
import { useRouteData } from "~/hooks";
import { AttributeForm } from "~/interfaces/Resources/Attributes";
import type { AttributeDataType } from "~/interfaces/Resources/types";

export default function NewAttributeRoute() {
  const { categoryId } = useParams();
  if (!categoryId) throw new Error("categoryId is not found");

  const navigate = useNavigate();
  const onClose = () => navigate(-1);
  const attributesRouteData = useRouteData<{
    dataTypes: AttributeDataType[];
  }>("/x/resources/attributes");

  return (
    <AttributeForm
      initialValues={{
        name: "",
        attributeDataTypeId: undefined,
        userAttributeCategoryId: categoryId,
        canSelfManage: true,
      }}
      dataTypes={attributesRouteData?.dataTypes ?? []}
      onClose={onClose}
    />
  );
}
