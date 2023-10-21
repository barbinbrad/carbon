import { Box } from "@chakra-ui/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { PageTitle, SectionTitle } from "~/components/Layout";
import type { PrivateAttributes } from "~/modules/account";
import { getPrivateAttributes, UserAttributesForm } from "~/modules/account";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { path } from "~/utils/path";
import { error } from "~/utils/result";

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, userId } = await requirePermissions(request, {});

  const [privateAttributes] = await Promise.all([
    getPrivateAttributes(client, userId),
  ]);

  if (privateAttributes.error) {
    return redirect(
      path.to.authenticatedRoot,
      await flash(
        request,
        error(privateAttributes.error, "Failed to get user attributes")
      )
    );
  }

  return json({ attributes: privateAttributes.data });
}

export default function AccountPersonal() {
  const { attributes } = useLoaderData<typeof loader>();
  return (
    <>
      <PageTitle
        title="Personal Data"
        subtitle="This information is private and can only be seen by you and authorized employees."
      />
      {/* <PersonalDataForm personalData={{}} /> */}
      {attributes.map((category: PrivateAttributes) => (
        <Box key={category.id} mb={8} w="full">
          <SectionTitle>{category.name}</SectionTitle>

          <UserAttributesForm attributeCategory={category} />
        </Box>
      ))}
    </>
  );
}
