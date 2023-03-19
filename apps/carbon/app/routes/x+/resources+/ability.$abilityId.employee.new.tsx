import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useNavigate, useParams } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import { useRouteData } from "~/hooks";
import { EmployeeAbilityForm } from "~/modules/resources/interfaces/Abilities";
import type { Ability } from "~/modules/resources";
import { AbilityEmployeeStatus } from "~/modules/resources";
import { requirePermissions } from "~/services/auth";
import {
  employeeAbilityValidator,
  upsertEmployeeAbility,
} from "~/modules/resources";
import { flash } from "~/services/session";
import { error, success } from "~/utils/result";

export async function action({ params, request }: ActionArgs) {
  const { abilityId } = params;
  if (!abilityId) throw new Error("abilityId is not found");

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

  const insertEmployeeAbility = await upsertEmployeeAbility(client, {
    employeeId,
    abilityId,
    trainingCompleted: trainingStatus === AbilityEmployeeStatus.Complete,
    trainingDays: trainingDays || 0,
  });

  if (insertEmployeeAbility.error) {
    return redirect(
      `/x/resources/ability/${abilityId}`,
      await flash(
        request,
        error(
          insertEmployeeAbility.error,
          "Failed to insert new employee ability"
        )
      )
    );
  }

  return redirect(
    `/x/resources/ability/${abilityId}`,
    await flash(request, success("Employee ability created"))
  );
}

export default function NewEmployeeAbilityRoute() {
  const { abilityId } = useParams();
  if (!abilityId) throw new Error("abilityId is not found");

  const navigate = useNavigate();
  const onClose = () => navigate(-1);
  const abilitiesRouteData = useRouteData<{
    ability: Ability;
    weeks: number;
  }>(`/x/resources/ability/${abilityId}`);

  if (!abilitiesRouteData?.ability) return null;

  return (
    <EmployeeAbilityForm
      initialValues={{
        // @ts-expect-error
        employeeId: undefined,
      }}
      ability={abilitiesRouteData?.ability}
      weeks={abilitiesRouteData.weeks}
      onClose={onClose}
    />
  );
}
