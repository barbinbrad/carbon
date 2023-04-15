import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import {
  PartInventoryForm,
  getPartInventory,
  getShelvesList,
  insertShelf,
  partInventoryValidator,
  upsertPartInventory,
} from "~/modules/parts";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { assertIsPost } from "~/utils/http";
import { error, success } from "~/utils/result";

export async function loader({ request, params }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    view: "parts",
  });

  const { partId } = params;
  if (!partId) throw new Error("Could not find partId");

  const [partInventory, shelves] = await Promise.all([
    getPartInventory(client, partId),
    getShelvesList(client),
  ]);

  if (partInventory.error) {
    return redirect(
      "/x/parts",
      await flash(
        request,
        error(partInventory.error, "Failed to load part inventory")
      )
    );
  }
  if (shelves.error) {
    return redirect(
      "/x/parts",
      await flash(request, error(shelves.error, "Failed to load shelves"))
    );
  }

  return json({
    partInventory: partInventory.data,
    shelves: shelves.data.map((s) => s.id),
  });
}

export async function action({ request, params }: ActionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    update: "parts",
  });

  const { partId } = params;
  if (!partId) throw new Error("Could not find partId");

  // validate with partsValidator
  const validation = await partInventoryValidator.validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { hasNewShelf, ...update } = validation.data;
  console.log({ hasNewShelf, update });

  if (hasNewShelf === "true" && update.shelfId) {
    const createShelf = await insertShelf(client, update.shelfId, userId);
    if (createShelf.error) {
      return redirect(
        `/x/part/${partId}/inventory`,
        await flash(
          request,
          error(createShelf.error, "Failed to create new shelf")
        )
      );
    }
  }

  const updatePartInventory = await upsertPartInventory(client, {
    ...update,
    partId,
    updatedBy: userId,
  });
  if (updatePartInventory.error) {
    return redirect(
      `/x/part/${partId}`,
      await flash(
        request,
        error(updatePartInventory.error, "Failed to update part inventory")
      )
    );
  }

  return redirect(
    `/x/part/${partId}/inventory`,
    await flash(request, success("Updated part inventory"))
  );
}

export default function PartInventoryRoute() {
  const { partInventory, shelves } = useLoaderData<typeof loader>();
  const initialValues = {
    ...partInventory,
    shelfId: partInventory.shelfId ?? undefined,
  };
  return <PartInventoryForm initialValues={initialValues} shelves={shelves} />;
}
