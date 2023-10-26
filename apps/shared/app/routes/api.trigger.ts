import { createRemixRoute } from "@trigger.dev/remix";
import { triggerClient } from "~/lib/trigger.server";

// Remix will automatically strip files with side effects
// So we need to *export* our Job definitions like this:
export * from "~/jobs/get-exchange-rates.server";

export const { action } = createRemixRoute(triggerClient);
