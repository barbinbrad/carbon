// root.tsx
import React, { useContext, useEffect } from "react";
import { SkipNavLink } from "@chakra-ui/skip-nav";
import { withEmotionCache } from "@emotion/react";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { json } from "@remix-run/node";
import type { MetaFunction, LoaderArgs } from "@remix-run/node";
import { ThemeProvider } from "@carbon/react";
import { getBrowserEnv } from "~/config/env";
import { ServerStyleContext, ClientStyleContext } from "~/lib/emotion";
import Background from "~/styles/background.css";

export function links() {
  return [{ rel: "stylesheet", href: Background }];
}

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Carbon ERP",
  viewport: "width=device-width,initial-scale=1",
});

interface DocumentProps {
  children: React.ReactNode;
}

export async function loader({ request }: LoaderArgs) {
  const { SUPABASE_API_URL, SUPABASE_ANON_PUBLIC } = getBrowserEnv();
  return json({
    env: {
      SUPABASE_API_URL,
      SUPABASE_ANON_PUBLIC,
    },
  });
}

const Document = withEmotionCache(
  ({ children }: DocumentProps, emotionCache) => {
    const { env } = useLoaderData<typeof loader>();
    const serverStyleData = useContext(ServerStyleContext);
    const clientStyleData = useContext(ClientStyleContext);

    useEffect(() => {
      emotionCache.sheet.container = document.head;
      const tags = emotionCache.sheet.tags;
      emotionCache.sheet.flush();
      tags.forEach((tag) => {
        (emotionCache.sheet as any)._insertTag(tag);
      });
      clientStyleData?.reset();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <html lang="en">
        <head>
          <Meta />
          <Links />
          {serverStyleData?.map(({ key, ids, css }) => (
            <style
              key={key}
              data-emotion={`${key} ${ids.join(" ")}`}
              dangerouslySetInnerHTML={{ __html: css }}
            />
          ))}
        </head>
        <body>
          <ThemeProvider>
            <SkipNavLink zIndex={7}>Skip to content</SkipNavLink>
            {children}
          </ThemeProvider>

          <ScrollRestoration />
          <script
            dangerouslySetInnerHTML={{
              __html: `window.env = ${JSON.stringify(env)}`,
            }}
          />
          <Scripts />
          <LiveReload />
        </body>
      </html>
    );
  }
);

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}
