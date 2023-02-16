import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import { AbilityForm } from "~/interfaces/Resources/Abilities";
import { assertIsPost } from "~/utils/http";
import { error, success } from "~/utils/result";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { abilityValidator, insertAbility } from "~/services/resources";

function makeCurve(startingPoint: number, weeks: number) {
  return {
    data: [
      {
        week: 0,
        value: startingPoint,
      },
      {
        week: weeks / 4,
        value: (100 - startingPoint) * 0.5 + startingPoint,
      },
      {
        week: weeks / 2,
        value: 100 - (100 - startingPoint) * 0.25,
      },
      {
        week: weeks,
        value: 100,
      },
    ],
  };
}

export async function action({ request }: ActionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    create: "resources",
  });

  const validation = await abilityValidator.validate(await request.formData());

  if (validation.error) {
    return validationError(validation.error);
  }

  const { name, startingPoint, weeks } = validation.data;

  const createAbility = await insertAbility(client, {
    name,
    curve: makeCurve(startingPoint, weeks),
    createdBy: userId,
  });
  if (createAbility.error) {
    return json(
      {},
      await flash(
        request,
        error(createAbility.error, "Failed to insert ability")
      )
    );
  }

  // const abilityId = createAbility.data[0]?.id;
  // if (!abilityId) {
  //   return json(
  //     {},
  //     await flash(request, error(createAbility, "Failed to insert ability"))
  //   );
  // }

  // const insertAbilityUsers = await upsertAbilityUsers(
  //   client,
  //   abilityId,
  //   selections
  // );

  // if (insertAbilityUsers.error) {
  //   await deleteAbility(client, abilityId);
  //   return json(
  //     {},
  //     await flash(
  //       request,
  //       error(insertAbilityUsers.error, "Failed to insert ability members")
  //     )
  //   );
  // }

  return redirect(
    "/x/resources/abilities",
    await flash(request, success(`Ability created`))
  );
}

export default function NewAbilityRoute() {
  const initialValues = {
    name: "",
    startingPoint: 85,
    weeks: 4,
  };

  return <AbilityForm initialValues={initialValues} />;
}
