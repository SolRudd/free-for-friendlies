import type { SupabaseClient } from "@supabase/supabase-js";
import { createBrowserClient } from "@supabase/ssr";
import { getSupabasePublicEnv } from "@/lib/supabase/env";

let browserClient: SupabaseClient | null | undefined;

export function createClient() {
  if (browserClient !== undefined) {
    return browserClient;
  }

  const env = getSupabasePublicEnv();

  if (!env.isConfigured) {
    browserClient = null;
    return browserClient;
  }

  browserClient = createBrowserClient(env.url, env.anonKey);
  return browserClient;
}
