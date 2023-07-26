import { useNotification, useColor } from "@carbon/react";
import { Flex, Grid, GridItem, VStack } from "@chakra-ui/react";
import { SkipNavContent } from "@chakra-ui/skip-nav";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData, useNavigation } from "@remix-run/react";
import NProgress from "nprogress";
import { useEffect } from "react";
import { IconSidebar, Topbar } from "~/components/Layout";
import { getSupabase, SupabaseProvider } from "~/lib/supabase";
import { getUserClaims, getUser, getUserGroups } from "~/modules/users";
import {
  destroyAuthSession,
  getSessionFlash,
  requireAuthSession,
} from "~/services/session";

export async function loader({ request }: LoaderArgs) {
  const { accessToken, expiresAt, expiresIn, userId } =
    await requireAuthSession(request, { verify: true });

  // share a client between requests
  const client = getSupabase(accessToken);

  // parallelize the requests
  const [sessionFlash, user, claims, groups] = await Promise.all([
    getSessionFlash(request),
    getUser(client, userId),
    getUserClaims(request, client),
    getUserGroups(client, userId),
  ]);

  if (!claims || user.error || !user.data || !groups.data) {
    await destroyAuthSession(request);
  }

  return json(
    {
      session: {
        accessToken,
        expiresIn,
        expiresAt,
      },

      user: user.data,
      groups: groups.data,
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
  const transition = useNavigation();

  /* Toast Messages */
  useEffect(() => {
    if (result?.success === true) {
      notify.success(result.message);
    } else if (result?.message) {
      notify.error(result.message);
    }
  }, [result, notify]);

  /* NProgress */
  useEffect(() => {
    if (transition.state === "loading") {
      NProgress.start();
    } else {
      NProgress.done();
    }
  }, [transition.state]);

  return (
    <SupabaseProvider session={session}>
      <Grid h="100vh" w="100vw" templateColumns="auto 1fr">
        <IconSidebar />
        <GridItem w="full" h="full">
          <Grid templateRows="auto 1fr" h="full" w="full">
            <Topbar />
            <Flex w="full" h="full">
              <SkipNavContent />
              <VStack spacing={0} w="full" bg={useColor("gray.50")}>
                <Outlet />
              </VStack>
            </Flex>
          </Grid>
        </GridItem>
      </Grid>
    </SupabaseProvider>
  );
}
