import { format } from "https://deno.land/std@0.160.0/datetime/mod.ts";
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.33.1";
import { Kysely } from "https://esm.sh/kysely@0.23.4";
import { Database } from "../../../src/types.ts";
import { DB } from "../lib/database.ts";

// TODO: refactor to use @internationalized/date when npm:<package>@<version> is supported

const daysInMonths: Record<number, number> = {
  1: 31,
  2: 28,
  3: 31,
  4: 30,
  5: 31,
  6: 30,
  7: 31,
  8: 31,
  9: 30,
  10: 31,
  11: 30,
  12: 31,
};

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// tries to get the current accounting period
// and if not found, creates a fiscal year and accounting periods
// and updates the active accounting period/fiscal year

export async function getCurrentAccountingPeriod<T>(
  client: SupabaseClient<Database>,
  db: Kysely<DB>
) {
  // const d = today(getLocalTimeZone());
  const d = format(new Date(), "yyyy-MM-dd");

  // get the current accounting period
  let currentAccountingPeriod = await client
    .from("accountingPeriod")
    .select("*")
    // .gte("endDate", d.toString())
    // .lte("startDate", d.toString())
    .gte("endDate", d)
    .lte("startDate", d)
    .single();

  if (
    currentAccountingPeriod.data &&
    currentAccountingPeriod.data.status === "Active"
  ) {
    return currentAccountingPeriod.data.id;
  }

  if (
    currentAccountingPeriod.data &&
    currentAccountingPeriod.data.status === "Inactive"
  ) {
    await db.transaction().execute(async (trx) => {
      await trx
        .updateTable("accountingPeriod")
        .set({ status: "Inactive" })
        .where("status", "=", "Active")
        .execute();

      await trx
        .updateTable("accountingPeriod")
        .set({ status: "Active" })
        .where("id", "=", currentAccountingPeriod.data!.id)
        .execute();
    });

    return currentAccountingPeriod.data.id;
  }

  // if there is not current accounting period, we'll need to create one
  // we may also need to create a new fiscal year

  const [fiscalYear, fiscalYearSettings] = await Promise.all([
    client
      .from("fiscalYear")
      .select("*")
      // .gte("startDate", d.toString())
      // .lte("endDate", d.toString())
      .gte("startDate", d)
      .lte("endDate", d)
      .single(),
    client.from("fiscalYearSettings").select("*").single(),
  ]);

  if (fiscalYearSettings.error || !fiscalYearSettings.data) {
    throw new Error("Fiscal year settings not found");
  }

  await db.transaction().execute(async (trx) => {
    const startYear = new Date().getFullYear();
    const startMonth = getMonthNumberFromString(
      fiscalYearSettings.data.startMonth
    );

    const endMonth = startMonth === 1 ? 12 : startMonth - 1;
    const endYear = startMonth === 1 ? startYear : startYear + 1;

    // const fiscalYearStartDate = new CalendarDate(d.year, startMonth, 1);
    // const fiscalYearEndDate = fiscalYearStartDate
    //   .add({ years: 1 })
    //   .add({ days: -1 });

    if (fiscalYear.data === null) {
      await trx
        .updateTable("fiscalYear")
        .set({ status: "Inactive" })
        .where("status", "=", "Active")
        .execute();

      // const year = `${months[fiscalYearStartDate.month - 1]} ${fiscalYearStartDate.year}-${fiscalYearEndDate.year}`;
      const yearName = `${months[startMonth - 1]} ${startYear} - ${
        months[endMonth - 1]
      } ${endYear}`;

      await trx
        .insertInto("fiscalYear")
        .values([
          {
            year: yearName,
            // startDate: fiscalYearStartDate.toString(),
            // endDate: fiscalYearEndDate.toString(),
            startDate: `${startYear}-${startMonth
              .toString()
              .padStart(2, "0")}-01`,
            endDate: `${endYear}-${endMonth
              .toString()
              .padStart(2, "0")}-${daysInMonths[endMonth]
              .toString()
              .padStart(2, "0")}`,
            status: "Active",
            createdBy: "system",
          },
        ])
        .returning(["year"])
        .execute();

      const accountingPeriods: Database["public"]["Tables"]["accountingPeriod"]["Insert"][] =
        [];
      for (let i = 0; i < 12; i++) {
        const j = i + startMonth;
        const month = j > 12 ? j - 12 : j;
        const year = j > 12 ? startYear + 1 : startYear;
        const startDate = `${year}-${month.toString().padStart(2, "0")}-01`;
        const endDate = `${year}-${month
          .toString()
          .padStart(2, "0")}-${daysInMonths[month]
          .toString()
          .padStart(2, "0")}`;

        const isActive = d >= startDate && d <= endDate;

        accountingPeriods.push({
          // startDate: startDate.toString(),
          // endDate: endDate.toString(),
          startDate,
          endDate,
          status: isActive ? "Active" : "Inactive",
          createdBy: "system",
          fiscalYear: yearName,
        });
      }

      await trx
        .insertInto("accountingPeriod")
        .values(accountingPeriods)
        .execute();
    }
  });

  // get the current accounting period now that we've inserted them
  currentAccountingPeriod = await client
    .from("accountingPeriod")
    .select("*")
    // .gte("startDate", d.toString())
    // .lte("endDate", d.toString())
    .gte("endDate", d)
    .lte("startDate", d)
    .single();

  if (currentAccountingPeriod.error || !currentAccountingPeriod.data) {
    throw new Error("Current accounting period not found");
  }

  return currentAccountingPeriod.data.id;
}

function getMonthNumberFromString(month: string) {
  const d = Date.parse(month + "1, 2012");
  if (!isNaN(d)) {
    return new Date(d).getMonth() + 1;
  }
  throw new Error("Invalid month");
}
