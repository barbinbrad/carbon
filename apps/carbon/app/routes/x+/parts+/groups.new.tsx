import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import { useRouteData } from "~/hooks";
import {
  PartGroupForm,
  partGroupValidator,
  upsertPartGroup,
} from "~/modules/parts";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { assertIsPost } from "~/utils/http";
import { error, success } from "~/utils/result";

export async function loader({ request }: LoaderArgs) {
  await requirePermissions(request, {
    create: "parts",
  });

  return null;
}

export async function action({ request }: ActionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    create: "parts",
  });

  const validation = await partGroupValidator.validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { id, ...data } = validation.data;

  const insertPartGroup = await upsertPartGroup(client, {
    ...data,
    createdBy: userId,
  });
  if (insertPartGroup.error) {
    return json(
      {},
      await flash(
        request,
        error(insertPartGroup.error, "Failed to insert part group")
      )
    );
  }

  const partGroupId = insertPartGroup.data?.id;
  if (!partGroupId) {
    return json(
      {},
      await flash(
        request,
        error(insertPartGroup, "Failed to insert part group")
      )
    );
  }

  return redirect(
    "/x/parts/groups",
    await flash(request, success("Part group created"))
  );
}

export default function NewPartGroupsRoute() {
  const routeData = useRouteData<{
    accounts: { name: string; number: string }[];
  }>("/x/parts/groups");

  const initialValues = {
    name: "",
    description: "",
  };

  return (
    <PartGroupForm
      accounts={routeData?.accounts ?? []}
      initialValues={initialValues}
    />
  );
}
