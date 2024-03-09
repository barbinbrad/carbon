import { intervalTrigger } from "@trigger.dev/sdk";
import { getExchangeRatesClient } from "~/lib/exchange-rates.server";
import { getSupabaseServiceRole } from "~/lib/supabase";
import { triggerClient } from "~/lib/trigger.server";
import type { CurrencyCode } from "~/modules/accounting";
import { exchangeRatesFormValidator } from "~/modules/settings";

const supabaseClient = getSupabaseServiceRole();

const job = triggerClient.defineJob({
  id: "update-exchange-rates",
  name: "Update Currency Exchange Rates",
  version: "0.0.1",
  trigger: intervalTrigger({
    seconds: 60 * 60 * 8, // thrice a day
  }),
  run: async (payload, io, ctx) => {
    const integration = await supabaseClient
      .from("integration")
      .select("active, metadata")
      .eq("id", "exchange-rates-v1")
      .maybeSingle();

    const integrationMetadata = exchangeRatesFormValidator.safeParse(
      integration?.data?.metadata
    );

    if (!integrationMetadata.success || integration?.data?.active !== true)
      return;
    const exchangeRatesClient = getExchangeRatesClient(
      integrationMetadata.data.apiKey
    );

    if (!exchangeRatesClient) return;

    await io.logger.info(`💵 Exchange Rates Job: ${payload.lastTimestamp}`);
    await io.logger.info(JSON.stringify(exchangeRatesClient.getMetaData()));

    try {
      const rates = await exchangeRatesClient.getExchangeRates();
      const updatedAt = new Date().toISOString();
      await io.logger.info(JSON.stringify(rates));
      const { data } = await supabaseClient.from("currency").select("*");
      if (!data) return;

      const updates = data
        .map((currency) => ({
          ...currency,
          exchangeRate: Number(
            rates[currency.code as CurrencyCode]?.toFixed(
              currency.decimalPlaces
            )
          ),
          updatedAt,
        }))
        .filter((currency) => currency.exchangeRate);

      if (updates?.length === 0) return;

      const { error } = await supabaseClient.from("currency").upsert(updates);
      if (error) {
        await io.logger.error(JSON.stringify(error));
        return;
      }

      io.logger.log("Success");
    } catch (err) {
      // TODO: notify someone
      await io.logger.error(JSON.stringify(err));
    }
  },
});

export default job;
