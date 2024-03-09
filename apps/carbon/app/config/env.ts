import { isBrowser } from "@carbon/utils";

declare global {
  interface Window {
    env: {
      SUPABASE_URL: string;
      SUPABASE_ANON_PUBLIC: string;
    };
  }
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SUPABASE_URL: string;
      SUPABASE_SERVICE_ROLE: string;
      VERCEL_URL: string;
      SUPABASE_ANON_PUBLIC: string;
      SESSION_SECRET: string;
      SESSION_KEY: string;
      SESSION_ERROR_KEY: string;
    }
  }
}

type EnvOptions = {
  isSecret?: boolean;
  isRequired?: boolean;
};

function getEnv(
  name: string,
  { isRequired, isSecret }: EnvOptions = { isSecret: true, isRequired: true }
) {
  if (isBrowser && isSecret) return "";

  const source = (isBrowser ? window.env : process.env) ?? {};

  const value = source[name as keyof typeof source];

  if (!value && isRequired) {
    throw new Error(`${name} is not set`);
  }

  return value;
}

/**
 * Server env
 */
export const SUPABASE_SERVICE_ROLE = getEnv("SUPABASE_SERVICE_ROLE");
export const SESSION_SECRET = getEnv("SESSION_SECRET");
export const SESSION_KEY = "authenticated";
export const SESSION_ERROR_KEY = "error";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days;
export const REFRESH_ACCESS_TOKEN_THRESHOLD = 60 * 10; // 10 minutes left before token expires
export const VERCEL_URL = getEnv("VERCEL_URL");

/**
 * Shared envs
 */
export const NODE_ENV = getEnv("NODE_ENV", {
  isSecret: false,
  isRequired: false,
});
export const SUPABASE_API_URL = getEnv("SUPABASE_API_URL", { isSecret: false });
export const SUPABASE_STUDIO_URL = getEnv("SUPABASE_STUDIO_URL", {
  isSecret: false,
});
export const SUPABASE_PROJECT_REF = getEnv("SUPABASE_STUDIO_URL", {
  isSecret: false,
});
export const SUPABASE_ANON_PUBLIC = getEnv("SUPABASE_ANON_PUBLIC", {
  isSecret: false,
});

export function getBrowserEnv() {
  return {
    SUPABASE_API_URL,
    SUPABASE_ANON_PUBLIC,
  };
}

export function isVercel() {
  return VERCEL_URL.includes("vercel.app");
}
