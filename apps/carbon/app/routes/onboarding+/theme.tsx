import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  HStack,
  VStack,
  cn,
} from "@carbon/react";
import {
  ValidatedForm,
  validationError,
  validator,
} from "@carbon/remix-validated-form";
import { themes, type Theme } from "@carbon/utils";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { RxCheck } from "react-icons/rx";
import { Hidden, Submit } from "~/components/Form";
import { useOnboarding } from "~/hooks";
import { useMode } from "~/hooks/useMode";
import type { Theme as ThemeValue } from "~/modules/settings";
import { getTheme, themeValidator, updateTheme } from "~/modules/settings";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session.server";
import type { Handle } from "~/utils/handle";
import { assertIsPost } from "~/utils/http";
import { path } from "~/utils/path";
import { error } from "~/utils/result";

export const handle: Handle = {
  breadcrumb: "Theme",
  to: path.to.theme,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "settings",
  });

  const theme = await getTheme(client);

  return json({
    theme: theme.data?.theme ?? "Carbon",
  });
}

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    update: "settings",
  });
  const formData = await request.formData();

  const validation = await validator(themeValidator).validate(formData);

  if (validation.error) {
    return validationError(validation.error);
  }

  const { next, theme } = validation.data;
  if (!next) throw new Error("Fatal: next is required");

  const update = await updateTheme(client, {
    theme,
    updatedBy: userId,
  });
  if (update.error)
    return json(
      {},
      await flash(request, error(update.error, "Failed to update theme"))
    );

  return redirect(next);
}

export default function OnboardingTheme() {
  const { theme: initialTheme } = useLoaderData<typeof loader>();

  const [theme, setTheme] = useState<ThemeValue>(initialTheme as "zinc");
  const mode = useMode();

  const onThemeChange = (t: Theme) => {
    setTheme(t.name);

    const variables = mode === "dark" ? t.cssVars.dark : t.cssVars.light;

    Object.entries(variables).forEach(([key, value]) => {
      document.body.style.setProperty(`--${key}`, value);
    });
  };

  useEffect(() => {
    const t = themes.find((t) => t.name === theme);
    if (t) {
      onThemeChange(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const { next, previous } = useOnboarding();

  return (
    <Card className="max-w-lg">
      <ValidatedForm
        method="post"
        validator={themeValidator}
        defaultValues={{ theme: initialTheme as "zinc" }}
      >
        <CardHeader>
          <CardTitle>Choose your style</CardTitle>
          <CardDescription>
            You can change the UI style any time through the theme setting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Hidden name="next" value={next} />
          <Hidden name="theme" value={theme} />
          <VStack spacing={4}>
            <div className="w-full grid grid-cols-3 gap-4">
              {themes.map((t) => {
                const isActive = theme === t.name;
                return (
                  <Button
                    key={t.name}
                    variant="secondary"
                    onClick={() => onThemeChange(t)}
                    className={cn(
                      "justify-start",
                      isActive && "border-2 border-primary"
                    )}
                    style={
                      {
                        "--theme-primary": `hsl(${
                          t?.activeColor[mode === "dark" ? "dark" : "light"]
                        })`,
                      } as React.CSSProperties
                    }
                  >
                    <span
                      className={cn(
                        "mr-1 flex h-5 w-5 shrink-0 -translate-x-1 items-center justify-center rounded-full bg-[--theme-primary]"
                      )}
                    >
                      {isActive && <RxCheck className="h-4 w-4 text-white" />}
                    </span>
                    {t.label}
                  </Button>
                );
              })}
            </div>
          </VStack>
        </CardContent>
        <CardFooter>
          <HStack>
            {previous && (
              <Button
                variant="solid"
                isDisabled={!previous}
                size="md"
                asChild
                tabIndex={-1}
              >
                <Link to={previous} prefetch="intent">
                  Previous
                </Link>
              </Button>
            )}

            <Submit>Next</Submit>
          </HStack>
        </CardFooter>
      </ValidatedForm>
    </Card>
  );
}
