import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useNavigate } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import {
  upsertWorkCellType,
  WorkCellTypeForm,
  workCellTypeValidator,
} from "~/modules/resources";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { assertIsPost } from "~/utils/http";
import { error, success } from "~/utils/result";

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    update: "resources",
  });

  const validation = await workCellTypeValidator.validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { name, description, color, requiredAbility } = validation.data;

  const createWorkCellType = await upsertWorkCellType(client, {
    name,
    description,
    color,
    requiredAbility,
    createdBy: userId,
  });
  if (createWorkCellType.error) {
    return redirect(
      "/x/resources/work-cells",
      await flash(
        request,
        error(createWorkCellType.error, "Failed to create work cell type")
      )
    );
  }

  return redirect(
    "/x/resources/work-cells",
    await flash(request, success("Created work cell type "))
  );
}

export default function NewWorkCellTypeRoute() {
  const navigate = useNavigate();
  const onClose = () => navigate("/x/resources/work-cells");

  const initialValues = {
    name: "",
    description: "",
    color: "#000000",
  };

  return <WorkCellTypeForm onClose={onClose} initialValues={initialValues} />;
}
