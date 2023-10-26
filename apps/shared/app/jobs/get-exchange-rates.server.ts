import { intervalTrigger } from "@trigger.dev/sdk";
import { exchangeRatesClient } from "~/lib/fx.server";
import { supabaseClient } from "~/lib/supabase.server";
import { triggerClient } from "~/lib/trigger.server";

export const job = triggerClient.defineJob({
  id: "get-exchange-rates",
  name: "Update Currency Exchange Rates",
  version: "0.0.1",
  trigger: intervalTrigger({
    seconds: 60 * 12, // twice per day
  }),
  run: async (payload, io, ctx) => {
    await io.logger.info(`💵 Exchange Rates Job: ${payload.lastTimestamp}`);
    await io.logger.info(JSON.stringify(exchangeRatesClient.getMetaData()));

    try {
      const rates = await exchangeRatesClient.getExchangeRates();
      await io.logger.info(JSON.stringify(rates));
      const { error } = await supabaseClient
        .from("currencyExchangeRate")
        .insert(
          Object.entries(rates).map(([currency, exchangeRate]) => ({
            currency,
            exchangeRate,
          }))
        );
      if (error) {
        await io.logger.error(JSON.stringify(error));
        return;
      }

      io.logger.log("Success");
    } catch (err) {
      // TODO: notify SRE
      await io.logger.error(JSON.stringify(err));
    }
  },
});
