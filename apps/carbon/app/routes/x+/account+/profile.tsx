import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  VStack,
} from "@carbon/react";
import { validationError, validator } from "@carbon/remix-validated-form";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { PageTitle } from "~/components/Layout";
import {
  ProfileForm,
  ProfilePhotoForm,
  UserAttributesForm,
  accountProfileValidator,
  getAccount,
  getPublicAttributes,
  updateAvatar,
  updatePublicAccount,
} from "~/modules/account";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session.server";
import type { Handle } from "~/utils/handle";
import { assertIsPost } from "~/utils/http";
import { path } from "~/utils/path";
import { error, success } from "~/utils/result";

export const handle: Handle = {
  breadcrumb: "Profile",
  to: path.to.profile,
};

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
    const validation = await validator(accountProfileValidator).validate(
      formData
    );

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
    if (photoPath === null || typeof photoPath === "string") {
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
        await flash(
          request,
          success(photoPath === null ? "Removed avatar" : "Updated avatar")
        )
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
        subtitle="This information will be visible to all users, so be careful what you
        share."
      />
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 w-full">
        <VStack spacing={8}>
          <ProfileForm user={user} />
          {attributes.length ? (
            <>
              {attributes.map((category) => (
                <Card key={category.id}>
                  <CardHeader>
                    <CardTitle>{category.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <UserAttributesForm attributeCategory={category} />
                  </CardContent>
                </Card>
              ))}
            </>
          ) : (
            <Card>
              <CardContent className="text-muted-foreground w-full text-center py-8">
                No public attributes
              </CardContent>
            </Card>
          )}
        </VStack>
        <ProfilePhotoForm user={user} />
      </div>
    </>
  );
}
