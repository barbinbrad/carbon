import { SUPABASE_API_URL, SUPABASE_STUDIO_URL } from "~/config/env";
import type { Database } from "@carbon/database";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function getTableSchema(
  client: SupabaseClient<Database>,
  tableId: string
) {
  const accessToken = client.realtime.accessToken;
  if (!accessToken) throw Error("Failed to get accessToken");
  const projectRef = "";
  const supabaseProjectDetailsEndpoint = SUPABASE_API_URL.includes("localhost")
    ? `${SUPABASE_STUDIO_URL}/api/projects/default`
    : `${SUPABASE_API_URL}/platform/projects/${projectRef}`;
  const supabaseProject = await fetch(`${supabaseProjectDetailsEndpoint}`);
  const data = await supabaseProject.json();
  if (!data) throw Error("Failed to fetch connection string");
  // platform/projects/{project_ref_here} with bearer token and project ref to get connectionString
  // const connectionString = data.connectionString;
  const tableSchemaEndpoint = SUPABASE_API_URL.includes("localhost")
    ? `${SUPABASE_STUDIO_URL}/api/pg-meta/default/tables?id=${tableId}`
    : `${SUPABASE_API_URL}/platform/pg-meta/{project_ref_here}/tables?id=${tableId}`;
  const tableSchemaResponse = await fetch(`${tableSchemaEndpoint}`);
  const response = tableSchemaResponse.json();
  return response;
}

export async function getViewSchema(
  client: SupabaseClient<Database>,
  viewId: string
) {
  const accessToken = client.realtime.accessToken;
  if (!accessToken) throw Error("Failed to get accessToken");
  const projectRef = "";
  const supabaseProjectDetailsEndpoint = SUPABASE_API_URL.includes("localhost")
    ? `${SUPABASE_STUDIO_URL}/api/projects/default`
    : `${SUPABASE_API_URL}/platform/projects/${projectRef}`;
  const supabaseProject = await fetch(`${supabaseProjectDetailsEndpoint}`);
  const data = await supabaseProject.json();
  if (!data) throw Error("Failed to fetch connection string");
  // platform/projects/{project_ref_here} with bearer token and project ref to get connectionString
  // const connectionString = data.connectionString;
  const viewSchemaEndpoint = SUPABASE_API_URL.includes("localhost")
    ? `${SUPABASE_STUDIO_URL}/api/pg-meta/default/views?id=${viewId}`
    : `${SUPABASE_API_URL}/platform/pg-meta/{project_ref_here}/views?id=${viewId}`;
  const viewSchemaResponse = await fetch(`${viewSchemaEndpoint}`);
  const response = viewSchemaResponse.json();
  return response;
}
