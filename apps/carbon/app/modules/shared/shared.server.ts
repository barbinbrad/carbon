import {
  SUPABASE_API_URL,
  SUPABASE_STUDIO_URL,
  SUPABASE_PROJECT_REF,
} from "~/config/env";
import type { Database } from "@carbon/database";
import type { SupabaseClient } from "@supabase/supabase-js";

const supabaseProjectDetailsEndpoint = SUPABASE_API_URL.includes("localhost")
  ? `${SUPABASE_STUDIO_URL}/api/projects/default`
  : `${SUPABASE_API_URL}/platform/projects/${SUPABASE_PROJECT_REF}`;

type Response<T> = { data: T; error: null } | { data: null; error: Error };

export async function getTableSchema<T>(
  client: SupabaseClient<Database>,
  tableId: string
): Promise<Response<T>> {
  try {
    const accessToken = client.realtime.accessToken;
    if (!accessToken) throw Error("Failed to get accessToken");
    const supabaseProject = await fetch(`${supabaseProjectDetailsEndpoint}`);
    const data = await supabaseProject.json();
    if (!data) throw Error("Failed to fetch connection string");
    // platform/projects/{project_ref_here} with bearer token and project ref to get connectionString
    // const connectionString = data.connectionString;
    const tableSchemaEndpoint = SUPABASE_API_URL.includes("localhost")
      ? `${SUPABASE_STUDIO_URL}/api/pg-meta/default/tables?id=${tableId}`
      : `${SUPABASE_API_URL}/platform/pg-meta/{project_ref_here}/tables?id=${tableId}`;
    const tableSchemaResponse = await fetch(`${tableSchemaEndpoint}`);
    const response = await tableSchemaResponse.json();
    return response;
  } catch (error) {
    console.log(error);
    throw new Error("Could not fetch table schema");
  }
}

export async function getViewSchema<T>(
  client: SupabaseClient<Database>,
  viewId: string
): Promise<Response<T>> {
  try {
    const accessToken = client.realtime.accessToken;
    if (!accessToken) throw Error("Failed to get accessToken");
    const supabaseProject = await fetch(`${supabaseProjectDetailsEndpoint}`);
    const data = await supabaseProject.json();
    if (!data) throw Error("Failed to fetch connection string");
    // platform/projects/{project_ref_here} with bearer token and project ref to get connectionString
    // const connectionString = data.connectionString;
    const viewSchemaEndpoint = SUPABASE_API_URL.includes("localhost")
      ? `${SUPABASE_STUDIO_URL}/api/pg-meta/default/views?id=${viewId}`
      : `${SUPABASE_API_URL}/platform/pg-meta/{project_ref_here}/views?id=${viewId}`;
    const viewSchemaResponse = await fetch(`${viewSchemaEndpoint}`);
    const response = await viewSchemaResponse.json();
    return response;
  } catch (error) {
    console.log(error);
    throw new Error("Could not fetch view schema");
  }
}
