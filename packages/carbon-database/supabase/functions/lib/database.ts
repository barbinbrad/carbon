import { Pool } from "https://deno.land/x/postgres@v0.17.0/mod.ts";
import {
  Kysely,
  PostgresAdapter,
  PostgresIntrospector,
  PostgresQueryCompiler,
} from "https://esm.sh/kysely@0.23.4";
import { PostgresDriver } from "../lib/driver.ts";

export function getConnectionPool(connections: number) {
  return new Pool(Deno.env.get("SUPABASE_DB_URL")!, connections);
  // TODO: if we're deploying to a remote environment, use this:
  // return new Pool(
  //   {
  //     tls: { caCertificates: [Deno.env.get("DB_SSL_CERT")!] },
  //     database: "postgres",
  //     hostname: Deno.env.get("DB_HOSTNAME"),
  //     user: "postgres",
  //     port: 5432,
  //     password: Deno.env.get("DB_PASSWORD"),
  //   },
  //   connections
  // );
}

export function getDatabaseClient<T>(pool: Pool): Kysely<T> {
  return new Kysely<T>({
    dialect: {
      createAdapter() {
        return new PostgresAdapter();
      },
      createDriver() {
        return new PostgresDriver({ pool });
      },
      createIntrospector(db: Kysely<unknown>) {
        return new PostgresIntrospector(db);
      },
      createQueryCompiler() {
        return new PostgresQueryCompiler();
      },
    },
  });
}
