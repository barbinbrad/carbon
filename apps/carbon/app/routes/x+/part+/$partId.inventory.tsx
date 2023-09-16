import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import { useRouteData } from "~/hooks";
import {
  getPartInventory,
  getPartQuantities,
  getShelvesList,
  insertShelf,
  PartInventoryForm,
  partInventoryValidator,
  upsertPartInventory,
} from "~/modules/parts";
import { getLocationsList } from "~/modules/resources";
import { getUserDefaults } from "~/modules/users";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import type { ListItem } from "~/types";
import { assertIsPost } from "~/utils/http";
import { error, success } from "~/utils/result";

export async function loader({ request, params }: LoaderArgs) {
  const { client, userId } = await requirePermissions(request, {
    view: "parts",
  });

  const { partId } = params;
  if (!partId) throw new Error("Could not find partId");

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  let locationId = searchParams.get("location");

  if (!locationId) {
    const userDefaults = await getUserDefaults(client, userId);
    if (userDefaults.error) {
      return redirect(
        `/x/part/${partId}`,
        await flash(
          request,
          error(userDefaults.error, "Failed to load default location")
        )
      );
    }

    locationId = userDefaults.data?.locationId ?? null;
  }

  if (!locationId) {
    const locations = await getLocationsList(client);
    if (locations.error || !locations.data?.length) {
      return redirect(
        `/x/part/${partId}`,
        await flash(
          request,
          error(locations.error, "Failed to load any locations")
        )
      );
    }
    locationId = locations.data?.[0].id as string;
  }

  let [partInventory, shelves] = await Promise.all([
    getPartInventory(client, partId, locationId),
    getShelvesList(client, locationId),
  ]);

  if (partInventory.error || !partInventory.data) {
    const insertPartInventory = await upsertPartInventory(client, {
      partId,
      locationId,
      createdBy: userId,
    });

    if (insertPartInventory.error) {
      return redirect(
        `/x/part/${partId}`,
        await flash(
          request,
          error(insertPartInventory.error, "Failed to insert part inventory")
        )
      );
    }

    partInventory = await getPartInventory(client, partId, locationId);
    if (partInventory.error || !partInventory.data) {
      return redirect(
        `/x/part/${partId}`,
        await flash(
          request,
          error(partInventory.error, "Failed to load part inventory")
        )
      );
    }
  }

  if (shelves.error) {
    return redirect(
      "/x/parts",
      await flash(request, error(shelves.error, "Failed to load shelves"))
    );
  }

  const quantities = await getPartQuantities(client, partId, locationId);
  if (quantities.error || !quantities.data) {
    return redirect(
      "/x/parts",
      await flash(request, error(quantities, "Failed to load part quantities"))
    );
  }

  return json({
    partInventory: partInventory.data,
    quantities: quantities.data,
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

  if (hasNewShelf === "true" && update.defaultShelfId) {
    const createShelf = await insertShelf(
      client,
      update.defaultShelfId,
      update.locationId,
      userId
    );
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
    `/x/part/${partId}/inventory?location=${update.locationId}`,
    await flash(request, success("Updated part inventory"))
  );
}

export default function PartInventoryRoute() {
  const sharedPartsData = useRouteData<{ locations: ListItem[] }>("/x/part");
  const { partInventory, quantities, shelves } = useLoaderData<typeof loader>();

  const initialValues = {
    ...partInventory,
    defaultShelfId: partInventory.defaultShelfId ?? undefined,
  };
  return (
    <PartInventoryForm
      initialValues={initialValues}
      quantities={quantities}
      locations={sharedPartsData?.locations ?? []}
      shelves={shelves}
    />
  );
}
