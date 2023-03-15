import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { redirect, json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import { WorkCellTypeForm } from "~/interfaces/Resources/WorkCells";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import {
  workCellTypeValidator,
  getWorkCellType,
  upsertWorkCellType,
} from "~/services/resources";
import { assertIsPost, notFound } from "~/utils/http";
import { error, success } from "~/utils/result";

export async function loader({ request, params }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    view: "resources",
    role: "employee",
  });

  const { typeId } = params;
  if (!typeId) throw notFound("Invalid work cell type id");

  const workCellType = await getWorkCellType(client, typeId);
  if (workCellType.error) {
    return redirect(
      "/x/resources/work-cells",
      await flash(
        request,
        error(workCellType.error, "Failed to fetch work cell type")
      )
    );
  }

  return json({ workCellType: workCellType.data });
}

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

  const { id, name, color, description, requiredAbility } = validation.data;
  if (!id) throw new Error("ID is was not found");

  const updateCategory = await upsertWorkCellType(client, {
    id,
    name,
    color,
    description,
    requiredAbility,
    updatedBy: userId,
  });
  if (updateCategory.error) {
    return redirect(
      "/x/resources/work-cells",
      await flash(
        request,
        error(updateCategory.error, "Failed to update work cell type")
      )
    );
  }

  return redirect(
    "/x/resources/work-cells",
    await flash(request, success("Updated work cell type "))
  );
}

export default function EditAttributeCategoryRoute() {
  const { workCellType } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const onClose = () => navigate("/x/resources/work-cells");

  const initialValues = {
    id: workCellType?.id,
    name: workCellType?.name ?? "",
    description: workCellType?.description ?? "",
    color: workCellType?.color ?? "#000000",
    requiredAbility: workCellType?.requiredAbility ?? undefined,
  };

  return <WorkCellTypeForm onClose={onClose} initialValues={initialValues} />;
}
