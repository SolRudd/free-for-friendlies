const requiredSupabaseEnvVars = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
] as const;

type RequiredSupabaseEnvVar = (typeof requiredSupabaseEnvVars)[number];

export function getSupabasePublicEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";

  const missing = requiredSupabaseEnvVars.filter((variable) => {
    if (variable === "NEXT_PUBLIC_SUPABASE_URL") {
      return !url;
    }

    return !anonKey;
  });

  if (missing.length > 0) {
    return {
      isConfigured: false as const,
      missing,
      url: "",
      anonKey: "",
    };
  }

  return {
    isConfigured: true as const,
    missing: [] as RequiredSupabaseEnvVar[],
    url,
    anonKey,
  };
}

export function hasSupabasePublicEnv() {
  return getSupabasePublicEnv().isConfigured;
}

export function getSupabaseServiceRoleKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || "";
}

export function hasSupabaseServiceRoleKey() {
  return Boolean(getSupabaseServiceRoleKey());
}

export function getSupabaseSetupMessage() {
  const env = getSupabasePublicEnv();

  if (env.isConfigured) {
    return "Supabase is configured.";
  }

  return `Supabase is not configured. Add ${env.missing.join(" and ")} before using auth or team features.`;
}
