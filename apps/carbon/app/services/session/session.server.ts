import { createCookieSessionStorage, json, redirect } from "@remix-run/node";

import {
  getCurrentPath,
  isGet,
  makeRedirectToFromHere,
  safeRedirect,
} from "~/utils/http";

import {
  NODE_ENV,
  SESSION_SECRET,
  SESSION_KEY,
  SESSION_ERROR_KEY,
  SESSION_MAX_AGE,
  REFRESH_ACCESS_TOKEN_THRESHOLD,
} from "~/config/env";

import { refreshAccessToken, verifyAuthSession } from "../auth/auth.server";
import type { AuthSession } from "../auth/types";
import type { Result } from "~/types";

async function assertAuthSession(
  request: Request,
  { onFailRedirectTo }: { onFailRedirectTo?: string } = {}
) {
  const authSession = await getAuthSession(request);

  // If there is no user session, Fly, You Fools! 🧙‍♂️
  if (!authSession?.accessToken || !authSession?.refreshToken) {
    throw redirect(
      `${onFailRedirectTo || "/login"}?${makeRedirectToFromHere(request)}`,
      {
        headers: {
          "Set-Cookie": await commitAuthSession(request, {
            authSession: null,
            flashErrorMessage: "No user session found", // TODO: handle this in UI
          }),
        },
      }
    );
  }

  return authSession;
}

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__authSession",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [SESSION_SECRET],
    secure: NODE_ENV === "production",
  },
});

export async function createAuthSession({
  request,
  authSession,
  redirectTo,
}: {
  request: Request;
  authSession: AuthSession;
  redirectTo: string;
}) {
  return redirect(safeRedirect(redirectTo), {
    headers: {
      "Set-Cookie": await commitAuthSession(request, {
        authSession,
        flashErrorMessage: null,
      }),
    },
  });
}

export async function commitAuthSession(
  request: Request,
  {
    authSession,
    flashErrorMessage,
  }: {
    authSession?: AuthSession | null;
    flashErrorMessage?: string | null;
  } = {}
) {
  const session = await getSession(request);

  // allow user session to be null.
  // useful you want to clear session and display a message explaining why
  if (authSession !== undefined) {
    session.set(SESSION_KEY, authSession);
  }

  session.flash(SESSION_ERROR_KEY, flashErrorMessage);

  return sessionStorage.commitSession(session, { maxAge: SESSION_MAX_AGE });
}

export async function destroyAuthSession(
  request: Request,
  shouldRedirect = true
) {
  const session = await getSession(request);

  return shouldRedirect
    ? redirect("/", {
        headers: {
          "Set-Cookie": await sessionStorage.destroySession(session),
        },
      })
    : json(
        {},
        {
          headers: {
            "Set-Cookie": await sessionStorage.destroySession(session),
          },
        }
      );
}

export async function flash(request: Request, result: Result) {
  const session = await getSession(request);
  if (typeof result.success === "boolean") {
    session.flash("success", result.success);
    session.flash("message", result.message);
  }

  return {
    headers: { "Set-Cookie": await sessionStorage.commitSession(session) },
  };
}

export async function getAuthSession(
  request: Request
): Promise<AuthSession | null> {
  const session = await getSession(request);
  return session.get(SESSION_KEY);
}

export async function getSessionFlash(request: Request) {
  const session = await getSession(request);

  const result: Result = {
    success: session.get("success") === true,
    message: session.get("message"),
  };

  if (!result.message) return null;

  const headers = { "Set-Cookie": await sessionStorage.commitSession(session) };

  return { result, headers };
}

async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}

function isExpiringSoon(expiresAt: number) {
  return (expiresAt - REFRESH_ACCESS_TOKEN_THRESHOLD) * 1000 < Date.now();
}

export async function requireAuthSession(
  request: Request,
  {
    onFailRedirectTo,
    verify,
  }: {
    onFailRedirectTo?: string;
    verify: boolean;
  } = { verify: false }
): Promise<AuthSession> {
  const authSession = await assertAuthSession(request, {
    onFailRedirectTo,
  });

  // by default we don't verify the session to save time
  const isValidSession = verify ? await verifyAuthSession(authSession) : true;

  // if not valid, we try to refresh the session
  if (!isValidSession || isExpiringSoon(authSession.expiresAt)) {
    return refreshAuthSession(request);
  }

  // finally, we have a valid session, let's return it
  return authSession;
}

export async function refreshAuthSession(
  request: Request
): Promise<AuthSession> {
  const authSession = await getAuthSession(request);

  const refreshedAuthSession = await refreshAccessToken(
    authSession?.refreshToken
  );

  // 👾 game over, log in again
  // yes, arbitrary, but it's a good way to don't let an illegal user here with an expired token
  if (!refreshedAuthSession) {
    const redirectUrl = `/login?${makeRedirectToFromHere(request)}`;

    // here we throw instead of return because this function promise a AuthSession and not a response object
    // https://remix.run/docs/en/v1/guides/constraints#higher-order-functions
    throw redirect(redirectUrl, {
      headers: {
        "Set-Cookie": await commitAuthSession(request, {
          authSession: null,
          flashErrorMessage: "fail-refresh-auth-session",
        }),
      },
    });
  }

  // refresh is ok and we can redirect
  if (isGet(request)) {
    // here we throw instead of return because this function promise a UserSession and not a response object
    // https://remix.run/docs/en/v1/guides/constraints#higher-order-functions
    throw redirect(getCurrentPath(request), {
      headers: {
        "Set-Cookie": await commitAuthSession(request, {
          authSession: refreshedAuthSession,
        }),
      },
    });
  }

  // we can't redirect because we are in an action, so, deal with it and don't forget to handle session commit 👮‍♀️
  return refreshedAuthSession;
}
