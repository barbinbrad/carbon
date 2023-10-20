import type { Database } from "@carbon/database";
import { redirect } from "@remix-run/node";
import type {
  AuthSession as SupabaseAuthSession,
  SupabaseClient,
} from "@supabase/supabase-js";
import { REFRESH_ACCESS_TOKEN_THRESHOLD, VERCEL_URL } from "~/config/env";
import { getSupabase, getSupabaseServiceRole } from "~/lib/supabase";
import { getUserClaims } from "~/modules/users";
import { flash, requireAuthSession } from "~/services/session";
import { path } from "~/utils/path";
import { error } from "~/utils/result";
import type { AuthSession } from "./types";

export async function createEmailAuthAccount(
  email: string,
  password: string,
  meta?: Record<string, unknown>
) {
  const { data, error } = await getSupabaseServiceRole().auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    app_metadata: {
      ...meta,
    },
  });

  if (!data.user || error) return null;

  return data.user;
}

export async function deleteAuthAccount(userId: string) {
  const { error } = await getSupabaseServiceRole().auth.admin.deleteUser(
    userId
  );

  if (error) return null;

  return true;
}

export async function getAuthAccountByAccessToken(accessToken: string) {
  const { data, error } = await getSupabaseServiceRole().auth.getUser(
    accessToken
  );

  if (!data.user || error) return null;

  return data.user;
}

function makeAuthSession(
  supabaseSession: SupabaseAuthSession | null
): AuthSession | null {
  if (!supabaseSession) return null;

  if (!supabaseSession.refresh_token)
    throw new Error("User should have a refresh token");

  if (!supabaseSession.user?.email)
    throw new Error("User should have an email");

  return {
    accessToken: supabaseSession.access_token,
    refreshToken: supabaseSession.refresh_token,
    userId: supabaseSession.user.id,
    email: supabaseSession.user.email,
    expiresIn:
      (supabaseSession.expires_in ?? 3600) - REFRESH_ACCESS_TOKEN_THRESHOLD,
    expiresAt: supabaseSession.expires_at ?? -1,
  };
}

export async function requirePermissions(
  request: Request,
  requiredPermissions: {
    view?: string | string[];
    create?: string | string[];
    update?: string | string[];
    delete?: string | string[];
    role?: string;
  }
): Promise<{
  client: SupabaseClient<Database>;
  email: string;
  userId: string;
}> {
  const { accessToken, email, userId } = await requireAuthSession(request);

  const client = getSupabase(accessToken);
  // early exit if no requiredPermissions are required
  if (Object.keys(requiredPermissions).length === 0)
    return { client, email, userId };

  const myClaims = await getUserClaims(request, client);

  const hasRequiredPermissions = Object.entries(requiredPermissions).every(
    ([action, permission]) => {
      if (typeof permission === "string") {
        if (action === "role") {
          return myClaims.role === permission;
        }
        if (!(permission in myClaims.permissions)) return false;
        return myClaims.permissions[permission][
          action as "view" | "create" | "update" | "delete"
        ];
      } else if (Array.isArray(permission)) {
        return permission.every((p) => {
          return myClaims.permissions[p][
            action as "view" | "create" | "update" | "delete"
          ];
        });
      } else {
        return false;
      }
    }
  );

  if (!hasRequiredPermissions) {
    throw redirect(
      path.to.home,
      await flash(
        request,
        error({ myClaims, requiredPermissions }, "Access Denied")
      )
    );
  }

  return { client, email, userId };
}

export async function resetPassword(accessToken: string, password: string) {
  const { error } = await getSupabase(accessToken).auth.updateUser({
    password,
  });

  if (error) return null;

  return true;
}

export async function sendInviteByEmail(
  email: string,
  data?: Record<string, unknown>
) {
  return getSupabaseServiceRole().auth.admin.inviteUserByEmail(email, {
    redirectTo: `${VERCEL_URL}/callback`,
    data,
  });
}

export async function sendMagicLink(email: string) {
  return getSupabaseServiceRole().auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${VERCEL_URL}/callback`,
    },
  });
}

export async function signInWithEmail(email: string, password: string) {
  const { data, error } =
    await getSupabaseServiceRole().auth.signInWithPassword({
      email,
      password,
    });

  if (!data.session || error) return null;

  return makeAuthSession(data.session);
}

export async function refreshAccessToken(
  refreshToken?: string
): Promise<AuthSession | null> {
  if (!refreshToken) return null;

  const { data, error } = await getSupabaseServiceRole().auth.refreshSession({
    refresh_token: refreshToken,
  });

  if (!data.session || error) return null;

  return makeAuthSession(data.session);
}

export async function verifyAuthSession(authSession: AuthSession) {
  const authAccount = await getAuthAccountByAccessToken(
    authSession.accessToken
  );

  return Boolean(authAccount);
}
