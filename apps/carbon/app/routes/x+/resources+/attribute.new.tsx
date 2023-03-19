import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import { attributeValidator, insertAttribute } from "~/modules/resources";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { assertIsPost } from "~/utils/http";
import { error, success } from "~/utils/result";

export async function action({ request }: ActionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    create: "resources",
  });

  const validation = await attributeValidator.validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const {
    name,
    attributeDataTypeId,
    userAttributeCategoryId,
    listOptions,
    canSelfManage,
  } = validation.data;

  const createAttribute = await insertAttribute(client, {
    name,
    attributeDataTypeId: Number(attributeDataTypeId),
    userAttributeCategoryId,
    listOptions,
    canSelfManage,
    createdBy: userId,
  });
  if (createAttribute.error) {
    return json(
      {},
      await flash(
        request,
        error(createAttribute.error, "Failed to create attribute")
      )
    );
  }

  return redirect(
    `/x/resources/attributes`,
    await flash(request, success("Created attribute"))
  );
}
