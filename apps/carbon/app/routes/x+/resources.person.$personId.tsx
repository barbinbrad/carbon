import { Box, Grid } from "@chakra-ui/react";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { usePermissions } from "~/hooks";
import {
  PersonAbilities,
  PersonHeader,
  PersonNotes,
  PersonTabs,
} from "~/interfaces/Resources";
import {
  getAccount,
  getPrivateAttributes,
  getPublicAttributes,
} from "~/services/account";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { error } from "~/utils/result";

export async function loader({ request, params }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    view: "resources",
  });

  const { personId } = params;

  if (!personId) {
    throw redirect(
      "/app/x/resources/people",
      await flash(request, error(null, "No person ID provided"))
    );
  }

  const [user, publicAttributes, privateAttributes] = await Promise.all([
    getAccount(client, personId),
    getPublicAttributes(client, personId),
    getPrivateAttributes(client, personId),
  ]);

  if (user.error || !user.data) {
    return redirect(
      "/x",
      await flash(request, error(user.error, "Failed to get user"))
    );
  }

  if (publicAttributes.error) {
    return redirect(
      "/x",
      await flash(
        request,
        error(publicAttributes.error, "Failed to get user attributes")
      )
    );
  }

  return json({
    user: user.data,
    publicAttributes: publicAttributes.data,
    privateAttributes: privateAttributes.data ?? [],
  });
}

export default function PersonRoute() {
  const { user, publicAttributes, privateAttributes } =
    useLoaderData<typeof loader>();
  const permissions = usePermissions();

  return (
    <Box p="4" w="full">
      <PersonHeader user={user} />
      <Grid
        gridTemplateColumns="5fr 3fr"
        gridColumnGap={8}
        gridRowGap={8}
        w="full"
      >
        <PersonTabs />
        <PersonAbilities />
        <PersonNotes />
      </Grid>
    </Box>
  );
}
