import { Box, Grid } from "@chakra-ui/react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import { PageTitle, SectionTitle } from "~/components/Layout";
import type { PublicAttributes } from "~/modules/account";
import {
  accountProfileValidator,
  getAccount,
  getPublicAttributes,
  ProfileForm,
  ProfilePhotoForm,
  updateAvatar,
  updatePublicAccount,
  UserAttributesForm,
} from "~/modules/account";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { assertIsPost } from "~/utils/http";
import { path } from "~/utils/path";
import { error, success } from "~/utils/result";

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, userId } = await requirePermissions(request, {});

  const [user, publicAttributes] = await Promise.all([
    getAccount(client, userId),
    getPublicAttributes(client, userId),
  ]);

  if (user.error || !user.data) {
    return redirect(
      path.to.authenticatedRoot,
      await flash(request, error(user.error, "Failed to get user"))
    );
  }

  if (publicAttributes.error) {
    return redirect(
      path.to.authenticatedRoot,
      await flash(
        request,
        error(publicAttributes.error, "Failed to get user attributes")
      )
    );
  }

  return json({ user: user.data, attributes: publicAttributes.data });
}

export async function action({ request }: ActionFunctionArgs) {
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
    const photoPath = formData.get("path");
    if (typeof photoPath === "string") {
      const avatarUpdate = await updateAvatar(client, userId, photoPath);
      if (avatarUpdate.error) {
        return redirect(
          path.to.profile,
          await flash(
            request,
            error(avatarUpdate.error, "Failed to update avatar")
          )
        );
      }

      return redirect(
        path.to.profile,
        await flash(request, success("Updated avatar"))
      );
    } else {
      return redirect(
        path.to.profile,
        await flash(request, error(null, "Invalid avatar path"))
      );
    }
  }

  return null;
}

export default function AccountProfile() {
  const { user, attributes } = useLoaderData<typeof loader>();

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
      {attributes.map((category: PublicAttributes) => (
        <Box key={category.id} mb={8} w="full">
          <SectionTitle title={category.name} />

          <UserAttributesForm attributeCategory={category} />
        </Box>
      ))}
    </>
  );
}
