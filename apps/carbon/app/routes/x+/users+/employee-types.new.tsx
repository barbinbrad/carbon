import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import {
  EmployeeTypeForm,
  employeeTypePermissionsValidator,
  employeeTypeValidator,
  getFeatures,
  insertEmployeeType,
  makeEmptyPermissionsFromFeatures,
  upsertEmployeeTypePermissions,
} from "~/modules/users";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { assertIsPost } from "~/utils/http";
import { error, success } from "~/utils/result";

export async function loader({ request }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    create: "users",
  });

  const features = await getFeatures(client);
  if (features.error || features.data === null) {
    return redirect(
      "/x/users/employee-types",
      await flash(request, error(features.error, "Failed to get features"))
    );
  }

  return json({
    permissions: makeEmptyPermissionsFromFeatures(features.data),
  });
}

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client } = await requirePermissions(request, {
    create: "users",
  });

  const validation = await employeeTypeValidator.validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { name, color, data } = validation.data;

  const permissions = JSON.parse(data);
  const jsonValidation =
    employeeTypePermissionsValidator.safeParse(permissions);
  if (jsonValidation.success === false) {
    return json(
      {},
      await flash(
        request,
        error(jsonValidation.error, "Failed to parse permissions")
      )
    );
  }

  const createEmployeeType = await insertEmployeeType(client, {
    name,
    color: color ?? undefined,
  });
  if (createEmployeeType.error) {
    return json(
      {},
      await flash(
        request,
        error(createEmployeeType.error, "Failed to insert employee type")
      )
    );
  }

  const employeeTypeId = createEmployeeType.data?.id;
  if (!employeeTypeId) {
    return json(
      {},
      await flash(
        request,
        error(createEmployeeType, "Failed to insert employee type")
      )
    );
  }
  const insertEmployeeTypePermissions = await upsertEmployeeTypePermissions(
    client,
    employeeTypeId,
    permissions
  );

  if (insertEmployeeTypePermissions.error) {
    return json(
      {},
      await flash(
        request,
        error(
          insertEmployeeTypePermissions.error,
          "Failed to insert employee type permissions"
        )
      )
    );
  }

  return redirect(
    "/x/users/employee-types",
    await flash(request, success("Employee type created"))
  );
}

export default function NewEmployeeTypesRoute() {
  const { permissions } = useLoaderData<typeof loader>();

  const initialValues = {
    name: "",
    color: "#000000",
    data: "",
    permissions,
  };

  return <EmployeeTypeForm initialValues={initialValues} />;
}
