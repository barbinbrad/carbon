import { exec } from "child_process";
import * as dotenv from "dotenv";
dotenv.config();

const SUPABASE_API_URL = process.env.SUPABASE_API_URL;

if (!SUPABASE_API_URL) {
  throw new Error("Missing SUPABASE_API_URL");
}

if (SUPABASE_API_URL.includes("localhost")) {
  exec("yarn db:types", (error, stdout, stderr) => {
    if (error) {
      console.error(`error: ${error.message}`);
      return;
    }

    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }

    console.log(`stdout:\n${stdout}`);
  });
}
