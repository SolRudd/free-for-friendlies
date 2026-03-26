import type { SupabaseClient, User } from "@supabase/supabase-js";

type ProfileOverride = {
  email?: string;
  fullName?: string;
};

export function getDisplayName(user: User, fallbackEmail?: string) {
  const metadataName =
    typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : typeof user.user_metadata?.name === "string"
        ? user.user_metadata.name
        : "";

  if (metadataName.trim()) {
    return metadataName.trim();
  }

  const email = fallbackEmail ?? user.email ?? "";
  return email ? email.split("@")[0] : "Team organiser";
}

export async function ensureProfile(
  supabase: SupabaseClient,
  user: User,
  override: ProfileOverride = {},
) {
  return supabase.from("profiles").upsert(
    {
      id: user.id,
      email: override.email ?? user.email ?? null,
      full_name: override.fullName ?? getDisplayName(user, override.email),
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "id",
    },
  );
}
