import { useNotification } from "@carbon/react";
import { Flex, Grid, GridItem, VStack } from "@chakra-ui/react";
import { SkipNavContent } from "@chakra-ui/skip-nav";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { useEffect } from "react";
import { IconSidebar, Topbar } from "~/components/Layout";
import { getSupabase, SupabaseProvider } from "~/lib/supabase";
import { getUserClaims, getCurrentUser } from "~/services/users";
import {
  destroyAuthSession,
  getSessionFlash,
  requireAuthSession,
} from "~/services/session";

export async function loader({ request }: LoaderArgs) {
  const { accessToken, expiresAt, expiresIn } = await requireAuthSession(
    request,
    { verify: true }
  );

  // share a client between requests
  const client = getSupabase(accessToken);

  // parallelize the requests
  const [sessionFlash, claims, user] = await Promise.all([
    getSessionFlash(request),
    getUserClaims(request, client),
    getCurrentUser(request, client),
  ]);

  if (!claims || !user) {
    await destroyAuthSession(request);
  }

  return json(
    {
      session: {
        accessToken,
        expiresIn,
        expiresAt,
      },

      user,
      permissions: claims?.permissions,
      role: claims?.role,
      result: sessionFlash?.result,
    },
    {
      headers: sessionFlash?.headers,
    }
  );
}

export default function AuthenticatedRoute() {
  const { session, result } = useLoaderData<typeof loader>();
  const notify = useNotification();

  useEffect(() => {
    if (result?.success === true) {
      notify.success(result.message);
    } else if (result?.message) {
      notify.error(result.message);
    }
  }, [result, notify]);

  return (
    <SupabaseProvider session={session}>
      <Grid h="100vh" w="100vw" templateRows="auto 1fr">
        <Topbar />
        <GridItem w="full" h="full">
          <Grid templateColumns="auto 1fr" h="full" w="full">
            <IconSidebar />
            <Flex w="full" h="full">
              <SkipNavContent />
              <VStack spacing={0} w="full">
                <Outlet />
              </VStack>
            </Flex>
          </Grid>
        </GridItem>
      </Grid>
    </SupabaseProvider>
  );
}
