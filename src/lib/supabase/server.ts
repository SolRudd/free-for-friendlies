import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { getSupabasePublicEnv } from "@/lib/supabase/env";

export async function createClient(): Promise<SupabaseClient | null> {
  const env = getSupabasePublicEnv();

  if (!env.isConfigured) {
    return null;
  }

  const cookieStore = await cookies();

  return createServerClient(
    env.url,
    env.anonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(
          cookiesToSet: { name: string; value: string; options: CookieOptions }[],
        ) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Server Components can't always write cookies. Middleware handles refreshes.
          }
        },
      },
    },
  );
}
