import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.GLOBAL_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.GLOBAL_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) throw new Error("GLOBAL_SUPABASE_URL not set");
if (!supabaseServiceRoleKey)
  throw new Error("GLOBAL_SUPABASE_SERVICE_ROLE not set");

export const supabaseClient = createClient(supabaseUrl, supabaseServiceRoleKey);
