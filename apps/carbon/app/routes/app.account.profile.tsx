import { Grid } from "@chakra-ui/react";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/router";
import { validationError } from "remix-validated-form";
import { PageTitle } from "~/components/Layout";
import { ProfileForm, ProfilePhotoForm } from "~/interfaces/Account/Profile";
import {
  accountProfileValidator,
  getAccountById,
  updateAvatar,
  updatePublicAccount,
} from "~/services/account";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { assertIsPost } from "~/utils/http";
import { error, success } from "~/utils/result";

export async function loader({ request }: LoaderArgs) {
  const { client, userId } = await requirePermissions(request, {});

  if (!userId) {
    return redirect(
      "/app",
      await flash(request, error(undefined, "Could not authenticate request"))
    );
  }

  const user = await getAccountById(client, userId);
  if (user.error || !user.data) {
    return redirect(
      "/app",
      await flash(request, error(user.error, "Failed to get user"))
    );
  }

  return json({ user: user.data });
}

export async function action({ request }: ActionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {});
  const formData = await request.formData();

  if (formData.get("intent") === "about") {
    const validation = await accountProfileValidator.validate(formData);

    if (validation.error) {
      return validationError(validation.error);
    }

    const { firstName, lastName, about } = validation.data;

    const updateAccount = await updatePublicAccount(client, {
      id: userId,
      firstName,
      lastName,
      about,
    });
    if (updateAccount.error)
      return json(
        {},
        await flash(
          request,
          error(updateAccount.error, "Failed to update profile")
        )
      );

    return json({}, await flash(request, success("Updated profile")));
  }

  if (formData.get("intent") === "photo") {
    const path = formData.get("path");
    if (path === null || typeof path === "string") {
      const avatarUpdate = await updateAvatar(client, userId, path);
      if (avatarUpdate.error) {
        return redirect(
          "/app/account/profile",
          await flash(
            request,
            error(avatarUpdate.error, "Failed to update avatar")
          )
        );
      }

      return redirect(
        "/app/account/profile",
        await flash(request, success("Updated avatar"))
      );
    } else {
      return redirect(
        "/app/account/profile",
        await flash(request, error(null, "Invalid avatar path"))
      );
    }
  }

  return null;
}

export default function AccountProfile() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <>
      <PageTitle
        title="Profile"
        subtitle="This information will be displayed publicly so be careful what you
        share."
      />
      <Grid
        gridTemplateColumns={["1fr", "1fr auto"]}
        w="full"
        gridColumnGap={8}
      >
        <ProfileForm user={user} />
        <ProfilePhotoForm user={user} />
      </Grid>
    </>
  );
}
