// root.tsx
import { Heading } from "@carbon/react";
import { validator } from "@carbon/remix-validated-form";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { Analytics } from "@vercel/analytics/react";
import React from "react";
import { getBrowserEnv } from "~/config/env";
import { getMode, setMode } from "~/services/mode.server";
import Background from "~/styles/background.css";
import NProgress from "~/styles/nprogress.css";
import Tailwind from "~/styles/tailwind.css";
import { error } from "~/utils/result";
import { useMode } from "./hooks/useMode";
import { modeValidator } from "./types/validators";

export function links() {
  return [
    { rel: "stylesheet", href: Tailwind },
    { rel: "stylesheet", href: Background },
    { rel: "stylesheet", href: NProgress },
  ];
}

export const meta: MetaFunction = () => {
  return [
    {
      charset: "utf-8",
    },
    {
      title: "Carbon ERP",
    },
    {
      viewport: "width=device-width",
    },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { SUPABASE_API_URL, SUPABASE_ANON_PUBLIC } = getBrowserEnv();
  return json({
    env: {
      SUPABASE_API_URL,
      SUPABASE_ANON_PUBLIC,
    },
    mode: getMode(request),
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const validation = await validator(modeValidator).validate(
    await request.formData()
  );

  if (validation.error) {
    return json(error(validation.error, "Invalid mode"), {
      status: 400,
    });
  }

  return json(
    {},
    {
      headers: { "Set-Cookie": setMode(validation.data.mode) },
    }
  );
}

function Document({
  children,
  title = "Carbon ERP",
  mode = "dark",
}: {
  children: React.ReactNode;
  title?: string;
  mode?: "light" | "dark";
}) {
  return (
    <html lang="en" className={`${mode} h-full overflow-x-hidden`}>
      <head>
        <Meta />
        <title>{title}</title>
        <Links />
      </head>
      <body className="bg-background">
        {children}
        <ScrollRestoration />
        <Scripts />
        <Analytics />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}

export default function App() {
  const loaderData = useLoaderData<typeof loader>();
  const env = loaderData?.env ?? {};

  const mode = useMode();

  return (
    <Document mode={mode}>
      <Outlet />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.env = ${JSON.stringify(env)}`,
        }}
      />
    </Document>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  const message = isRouteErrorResponse(error)
    ? error.data.message ?? error.data
    : error instanceof Error
    ? error.message
    : String(error);

  return (
    <Document title="Error!">
      <div className="dark">
        <div className="flex flex-col w-full h-screen bg-zinc-900 items-center justify-center space-y-4">
          <Heading size="display">Cuss! Something went wrong</Heading>
          <p className="text-foreground">{message}</p>
        </div>
      </div>
    </Document>
  );
}
