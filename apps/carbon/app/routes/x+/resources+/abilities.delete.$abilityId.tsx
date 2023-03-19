import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, useNavigate, useParams } from "@remix-run/react";
import { ConfirmDelete } from "~/components/Modals";
import { deleteAbility, getAbility } from "~/modules/resources";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { error, success } from "~/utils/result";
import { notFound } from "~/utils/http";

export async function loader({ request, params }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    view: "resources",
    role: "employee",
  });

  const { abilityId } = params;
  if (!abilityId) throw notFound("abilityId not found");

  const ability = await getAbility(client, abilityId);
  if (ability.error) {
    return redirect(
      "/x/resources/abilities",
      await flash(request, error(ability.error, "Failed to get ability"))
    );
  }

  return json({
    ability: ability.data,
  });
}

export async function action({ request, params }: ActionArgs) {
  const { client } = await requirePermissions(request, {
    delete: "resources",
  });

  const { abilityId } = params;
  if (!abilityId) {
    return redirect(
      "/x/resources/abilities",
      await flash(request, error(params, "Failed to get ability id"))
    );
  }

  const { error: deleteAbilityError } = await deleteAbility(client, abilityId);
  if (deleteAbilityError) {
    return redirect(
      "/x/resources/abilities",
      await flash(
        request,
        error(deleteAbilityError, "Failed to delete ability")
      )
    );
  }

  return redirect(
    "/x/resources/abilities",
    await flash(request, success("Successfully deleted employee type"))
  );
}

export default function DeleteEmployeeTypeRoute() {
  const { abilityId } = useParams();
  const { ability } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  if (!abilityId || !ability) return null; // TODO - handle this better (404?)

  const onCancel = () => navigate("/x/resources/abilities");

  return (
    <ConfirmDelete
      action={`/x/resources/abilities/delete/${abilityId}`}
      name={ability.name}
      text={`Are you sure you want to delete the ability: ${ability.name}? This cannot be undone.`}
      onCancel={onCancel}
    />
  );
}
