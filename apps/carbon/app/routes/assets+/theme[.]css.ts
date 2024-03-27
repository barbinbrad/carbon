import { getThemeCode, themes } from "@carbon/utils";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { getTheme } from "~/services/theme.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const theme = getTheme(request) as string;

  const selectedTheme = themes.find((t) => t.name === theme);

  if (!selectedTheme) {
    return new Response("", {
      headers: {
        "Content-Type": "text/css",
      },
    });
  }

  const css = getThemeCode(selectedTheme);

  return new Response(css, {
    headers: {
      "Content-Type": "text/css",
    },
  });
}
