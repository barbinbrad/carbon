import type { Database } from "@carbon/database";
import { redirect } from "@remix-run/node";
import type {
  AuthSession as SupabaseAuthSession,
  SupabaseClient,
} from "@supabase/supabase-js";
import { SERVER_URL } from "~/config/env";
import { REFRESH_ACCESS_TOKEN_THRESHOLD } from "~/config/env";
import { getSupabase, getSupabaseAdmin } from "~/lib/supabase";
import { requireAuthSession, flash } from "~/services/session";
import { getPermissions } from "~/services/users";
import { error } from "~/utils/result";
import type { AuthSession } from "./types";

export async function createEmailAuthAccount(
  email: string,
  password: string,
  meta?: Record<string, unknown>
) {
  const { data, error } = await getSupabaseAdmin().auth.admin.createUser({
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
  const { error } = await getSupabaseAdmin().auth.admin.deleteUser(userId);

  if (error) return null;

  return true;
}

export async function getAuthAccountByAccessToken(accessToken: string) {
  const { data, error } = await getSupabaseAdmin().auth.getUser(accessToken);

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

  const myPermissions = await getPermissions(request, client);

  const hasRequiredPermissions = Object.entries(requiredPermissions).every(
    ([action, permission]) => {
      if (typeof permission === "string") {
        return myPermissions![permission][
          action as "view" | "create" | "update" | "delete"
        ];
      } else if (Array.isArray(permission)) {
        return permission.every((p) => {
          return !myPermissions![p][
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
      "/app",
      await flash(
        request,
        error({ myPermissions, requirePermissions }, "Access Denied")
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
  return getSupabaseAdmin().auth.admin.inviteUserByEmail(email, {
    redirectTo: `${SERVER_URL}/callback`,
    data,
  });
}

export async function sendMagicLink(email: string) {
  return getSupabaseAdmin().auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${SERVER_URL}/callback`,
    },
  });
}

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await getSupabaseAdmin().auth.signInWithPassword({
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

  const { data, error } = await getSupabaseAdmin().auth.refreshSession({
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
