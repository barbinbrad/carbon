import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useNavigate } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import { WorkCellTypeForm } from "~/interfaces/Resources/WorkCells";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import {
  workCellTypeValidator,
  upsertWorkCellType,
} from "~/services/resources";
import { assertIsPost } from "~/utils/http";
import { error, success } from "~/utils/result";

export async function action({ request }: ActionArgs) {
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
