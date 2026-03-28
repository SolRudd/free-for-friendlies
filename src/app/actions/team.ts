"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseSetupMessage } from "@/lib/supabase/env";
import type { FormState } from "@/lib/form-state";
import { getTeamLogoFile, uploadTeamLogo } from "@/lib/team-logo";
import { emptyToNull, pickFormValues, teamSchema } from "@/lib/validation";
import { slugify } from "@/lib/utils/slugify";

const teamFields = [
  "name",
  "city",
  "area",
  "age_group",
  "skill_level",
  "team_format",
  "preferred_match_day",
  "pitch_status",
  "travel_willingness",
  "contact_email",
  "bio",
] as const;

function getPersistenceErrorMessage({
  errorMessage,
  fallback,
  foreignKeyFallback,
}: {
  errorMessage?: string;
  fallback: string;
  foreignKeyFallback?: string;
}) {
  const normalized = errorMessage?.toLowerCase() ?? "";

  if (
    normalized.includes("column") ||
    normalized.includes("schema cache") ||
    normalized.includes("relation") && normalized.includes("does not exist")
  ) {
    return "Your Supabase schema is missing one or more Free For Friendlies tables or columns. Apply the latest supabase-schema.sql changes, then try again.";
  }

  if (foreignKeyFallback && normalized.includes("foreign key")) {
    return foreignKeyFallback;
  }

  return fallback;
}

async function getAuthenticatedSupabase(values: Record<string, string>) {
  let supabase: SupabaseClient | null = null;

  try {
    supabase = await createClient();
  } catch {
    return {
      errorState: {
        message: "We couldn't save that team right now. Please try again.",
        values,
      } satisfies FormState,
      supabase: null,
      user: null,
    };
  }

  if (!supabase) {
    return {
      errorState: {
        message: getSupabaseSetupMessage(),
        values,
      } satisfies FormState,
      supabase: null,
      user: null,
    };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      errorState: {
        message: "Your session has expired. Log in again and retry.",
        values,
      } satisfies FormState,
      supabase,
      user: null,
    };
  }

  return {
    errorState: null,
    supabase,
    user,
  };
}

async function generateTeamSlug(baseName: string, supabase: SupabaseClient) {
  const baseSlug = slugify(baseName) || `team-${crypto.randomUUID().slice(0, 8)}`;
  const { data, error } = await supabase
    .from("teams")
    .select("slug")
    .ilike("slug", `${baseSlug}%`);

  if (error) {
    return baseSlug;
  }

  const existingSlugs = new Set((data ?? []).map((team) => team.slug));

  if (!existingSlugs.has(baseSlug)) {
    return baseSlug;
  }

  let counter = 2;

  while (existingSlugs.has(`${baseSlug}-${counter}`)) {
    counter += 1;
  }

  return `${baseSlug}-${counter}`;
}

async function maybeUploadTeamLogo({
  file,
  ownerId,
  teamId,
  teamName,
}: {
  file: File | null;
  ownerId: string;
  teamId: string;
  teamName: string;
}) {
  if (!file) {
    return {
      logoUrl: null as string | null,
      logoMessage: "",
    };
  }

  const upload = await uploadTeamLogo({
    file,
    ownerId,
    teamId,
    teamName,
  });

  if (!upload.url) {
    return {
      logoUrl: null,
      logoMessage: upload.error
        ? "&logo=warning"
        : "",
    };
  }

  return {
    logoUrl: upload.url,
    logoMessage: "",
  };
}

export async function createTeam(
  _previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  const values = pickFormValues(formData, teamFields);
  const parsed = teamSchema.safeParse(values);

  if (!parsed.success) {
    return {
      message: "Please check the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
      values,
    };
  }

  const logoFileState = getTeamLogoFile(formData.get("logo_file"));

  if (logoFileState.error) {
    return {
      message: logoFileState.error,
      values,
    };
  }

  const authState = await getAuthenticatedSupabase(values);

  if (authState.errorState || !authState.supabase || !authState.user) {
    return authState.errorState ?? {
      message: "We couldn't save that team right now. Please try again.",
      values,
    };
  }

  const { supabase, user } = authState;

  const { data: existingTeam } = await supabase
    .from("teams")
    .select("id")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existingTeam) {
    redirect("/dashboard/team?message=team-exists");
  }

  let redirectUrl = "/dashboard";

  try {
    const slug = await generateTeamSlug(parsed.data.name, supabase);
    const { data, error } = await supabase
      .from("teams")
      .insert({
        owner_id: user.id,
        name: parsed.data.name,
        slug,
        city: parsed.data.city,
        area: emptyToNull(parsed.data.area ?? ""),
        bio: emptyToNull(parsed.data.bio ?? ""),
        age_group: parsed.data.age_group,
        skill_level: parsed.data.skill_level,
        team_format: parsed.data.team_format,
        preferred_match_day: parsed.data.preferred_match_day,
        pitch_status: parsed.data.pitch_status,
        travel_willingness: parsed.data.travel_willingness,
        contact_email: parsed.data.contact_email,
        is_active: true,
      })
      .select("id, name, slug")
      .single();

    if (error || !data) {
      return {
        message: getPersistenceErrorMessage({
          errorMessage: error?.message,
          fallback: "We couldn't save that team right now. Please try again.",
          foreignKeyFallback:
            "We couldn't find your profile row. Log out and back in, then try again.",
        }),
        values,
      };
    }

    const logoResult = await maybeUploadTeamLogo({
      file: logoFileState.file,
      ownerId: user.id,
      teamId: data.id,
      teamName: parsed.data.name,
    });
    let logoMessage = logoResult.logoMessage;

    if (logoResult.logoUrl) {
      const { error: logoUpdateError } = await supabase
        .from("teams")
        .update({
          logo_url: logoResult.logoUrl,
        })
        .eq("id", data.id)
        .eq("owner_id", user.id);

      if (logoUpdateError) {
        logoMessage = "&logo=warning";
      }
    }

    redirectUrl = `/dashboard?message=team-created&team=${encodeURIComponent(data.name)}&slug=${encodeURIComponent(data.slug)}${logoMessage}`;
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/team");
    revalidatePath("/dashboard/team/new");
    revalidatePath("/dashboard/matches/new");
    revalidatePath("/teams");
  } catch {
    return {
      message: "We couldn't save that team right now. Please try again.",
      values,
    };
  }

  redirect(redirectUrl);
}

export async function updateTeam(
  _previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  const teamId = String(formData.get("team_id") ?? "").trim();
  const values = pickFormValues(formData, teamFields);
  const parsed = teamSchema.safeParse(values);

  if (!teamId) {
    return {
      message: "We couldn't work out which team to update.",
      values,
    };
  }

  if (!parsed.success) {
    return {
      message: "Please check the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
      values,
    };
  }

  const logoFileState = getTeamLogoFile(formData.get("logo_file"));

  if (logoFileState.error) {
    return {
      message: logoFileState.error,
      values,
    };
  }

  const authState = await getAuthenticatedSupabase(values);

  if (authState.errorState || !authState.supabase || !authState.user) {
    return authState.errorState ?? {
      message: "We couldn't update that team right now. Please try again.",
      values,
    };
  }

  const { supabase, user } = authState;

  const { data: existingTeam, error: existingTeamError } = await supabase
    .from("teams")
    .select("id, name, slug")
    .eq("id", teamId)
    .eq("owner_id", user.id)
    .maybeSingle();

  if (existingTeamError || !existingTeam) {
    return {
      message: "We couldn't find that team in your account.",
      values,
    };
  }

  let redirectUrl = "/dashboard/team";

  try {
    const nextSlug =
      existingTeam.name === parsed.data.name
        ? existingTeam.slug
        : await generateTeamSlug(parsed.data.name, supabase);

    const { error } = await supabase
      .from("teams")
      .update({
        name: parsed.data.name,
        slug: nextSlug,
        city: parsed.data.city,
        area: emptyToNull(parsed.data.area ?? ""),
        bio: emptyToNull(parsed.data.bio ?? ""),
        age_group: parsed.data.age_group,
        skill_level: parsed.data.skill_level,
        team_format: parsed.data.team_format,
        preferred_match_day: parsed.data.preferred_match_day,
        pitch_status: parsed.data.pitch_status,
        travel_willingness: parsed.data.travel_willingness,
        contact_email: parsed.data.contact_email,
        updated_at: new Date().toISOString(),
      })
      .eq("id", teamId)
      .eq("owner_id", user.id);

    if (error) {
      return {
        message: getPersistenceErrorMessage({
          errorMessage: error.message,
          fallback: "We couldn't update that team right now. Please try again.",
        }),
        values,
      };
    }

    const logoResult = await maybeUploadTeamLogo({
      file: logoFileState.file,
      ownerId: user.id,
      teamId,
      teamName: parsed.data.name,
    });
    let logoMessage = logoResult.logoMessage;

    if (logoResult.logoUrl) {
      const { error: logoUpdateError } = await supabase
        .from("teams")
        .update({
          logo_url: logoResult.logoUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", teamId)
        .eq("owner_id", user.id);

      if (logoUpdateError) {
        logoMessage = "&logo=warning";
      }
    }

    redirectUrl = `/dashboard/team?message=team-updated${logoMessage}`;
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/team");
    revalidatePath("/dashboard/team/new");
    revalidatePath("/dashboard/matches/new");
    revalidatePath("/teams");
  } catch {
    return {
      message: "We couldn't update that team right now. Please try again.",
      values,
    };
  }

  redirect(redirectUrl);
}
