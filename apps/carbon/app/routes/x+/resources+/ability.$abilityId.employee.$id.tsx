import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useLoaderData, useNavigate, useParams } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import { useRouteData } from "~/hooks";
import { EmployeeAbilityForm } from "~/modules/resources/interfaces/Abilities";
import type { Ability } from "~/modules/resources";
import {
  AbilityEmployeeStatus,
  employeeAbilityValidator,
  getEmployeeAbility,
  getTrainingStatus,
  upsertEmployeeAbility,
} from "~/modules/resources";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { error, success } from "~/utils/result";

export async function loader({ request, params }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    view: "resources",
  });

  // get the abilityId and id from the params
  const { abilityId, id } = params;
  if (!abilityId) {
    throw new Error("Ability ID not found");
  }

  if (!id) {
    throw new Error("Employee ID not found");
  }

  const employeeAbility = await getEmployeeAbility(client, abilityId, id);
  if (employeeAbility.error)
    redirect(
      "/x/resources/abilities",
      await flash(
        request,
        error(employeeAbility.error, "Failed to get employee ability")
      )
    );

  return { employeeAbility: employeeAbility.data };
}

export async function action({ params, request }: ActionArgs) {
  const { abilityId, id } = params;
  if (!abilityId) throw new Error("abilityId is not found");
  if (!id) throw new Error("id is not found");

  console.log(params);

  const { client } = await requirePermissions(request, {
    create: "resources",
  });

  const validation = await employeeAbilityValidator.validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { employeeId, trainingStatus, trainingDays } = validation.data;

  const updateEmployeeAbility = await upsertEmployeeAbility(client, {
    id,
    employeeId,
    abilityId,
    trainingCompleted: trainingStatus === AbilityEmployeeStatus.Complete,
    trainingDays: trainingDays || 0,
  });

  if (updateEmployeeAbility.error) {
    return redirect(
      `/x/resources/ability/${abilityId}`,
      await flash(
        request,
        error(
          updateEmployeeAbility.error,
          "Failed to insert new employee ability"
        )
      )
    );
  }

  return redirect(
    `/x/resources/ability/${abilityId}`,
    await flash(request, success("Employee ability updated"))
  );
}

export default function EmployeeAbilityRoute() {
  const navigate = useNavigate();
  const { abilityId } = useParams();
  const { employeeAbility } = useLoaderData<typeof loader>();
  const routeData = useRouteData<{
    ability: Ability;
    weeks: number;
  }>(`/x/resources/ability/${abilityId}`);

  if (Array.isArray(employeeAbility?.user)) {
    throw new Error("employeeAbility.user is an array");
  }

  const initialValues = {
    employeeId: employeeAbility?.user?.id ?? "",
    trainingStatus: getTrainingStatus(employeeAbility) ?? "",
    trainingPercent: getTrainingPercent(
      employeeAbility?.trainingDays,
      routeData?.weeks
    ),
  };

  return (
    <EmployeeAbilityForm
      ability={routeData?.ability}
      initialValues={initialValues}
      weeks={routeData?.weeks ?? 4}
      onClose={() => navigate(-1)}
    />
  );
}

function getTrainingPercent(traniningDays?: number, weeks?: number) {
  if (!traniningDays || !weeks) return 0;
  return (traniningDays / 5 / weeks) * 100;
}
