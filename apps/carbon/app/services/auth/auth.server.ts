import type { Database } from "@carbon/database";
import type {
  AuthSession as SupabaseAuthSession,
  SupabaseClient,
} from "@supabase/supabase-js";
import { SERVER_URL } from "~/config/env";
import { REFRESH_ACCESS_TOKEN_THRESHOLD } from "~/config/env";
import { getSupabase, getSupabaseAdmin } from "~/lib/supabase";
import type { AuthSession } from "./types";

export async function getUserByClient(client: SupabaseClient<Database>) {
  const {
    data: { user },
  } = await client.auth.getUser();
  return client
    .from("User")
    .select("email, firstName, lastName")
    .eq("email", user?.email)
    .single();
}

export async function getPermissionsByClient(client: SupabaseClient<Database>) {
  // TODO: map claims to permissions
  return client.rpc("get_my_claims");
}

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

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await getSupabaseAdmin().auth.signInWithPassword({
    email,
    password,
  });

  if (!data.session || error) return null;

  return makeAuthSession(data.session);
}

export async function sendMagicLink(email: string) {
  return getSupabaseAdmin().auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${SERVER_URL}/callback`,
    },
  });
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

export async function refreshAccessToken(
  refreshToken?: string
): Promise<AuthSession | null> {
  if (!refreshToken) return null;

  const { data, error } = await getSupabaseAdmin().auth.setSession({
    access_token: "",
    refresh_token: refreshToken,
  });

  if (!data.session || error) return null;

  return makeAuthSession(data.session);
}

export async function resetPassword(accessToken: string, password: string) {
  const { error } = await getSupabase(accessToken).auth.updateUser({
    password,
  });

  if (error) return null;

  return true;
}

export async function verifyAuthSession(authSession: AuthSession) {
  const authAccount = await getAuthAccountByAccessToken(
    authSession.accessToken
  );

  return Boolean(authAccount);
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
