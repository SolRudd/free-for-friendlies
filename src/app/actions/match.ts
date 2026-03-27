"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseSetupMessage } from "@/lib/supabase/env";
import type { FormState } from "@/lib/form-state";
import {
  emptyToNull,
  matchRequestSchema,
  pickFormValues,
} from "@/lib/validation";

const matchFields = [
  "team_id",
  "title",
  "city",
  "area",
  "age_group",
  "skill_level",
  "match_format",
  "venue_status",
  "travel_willingness",
  "preferred_date",
  "preferred_time",
  "description",
] as const;

export async function createMatchRequest(
  _previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  const values = pickFormValues(formData, matchFields);
  const parsed = matchRequestSchema.safeParse(values);

  if (!parsed.success) {
    return {
      message: "Please check the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
      values,
    };
  }

  let supabase: SupabaseClient | null = null;

  try {
    supabase = await createClient();
  } catch {
    return {
      message: "We couldn't publish that request right now. Please try again.",
      values,
    };
  }

  if (!supabase) {
    return {
      message: getSupabaseSetupMessage(),
      values,
    };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      message: "Your session has expired. Log in again and retry.",
      values,
    };
  }

  try {
    const { data: team, error: teamError } = await supabase
      .from("teams")
      .select("id")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (teamError || !team || team.id !== parsed.data.team_id) {
      return {
        message: "Post match requests from the team currently managed by your account.",
        values,
      };
    }

    const { error } = await supabase.from("match_requests").insert({
      team_id: parsed.data.team_id,
      title: parsed.data.title,
      description: emptyToNull(parsed.data.description ?? ""),
      city: parsed.data.city,
      area: emptyToNull(parsed.data.area ?? ""),
      age_group: parsed.data.age_group,
      skill_level: parsed.data.skill_level,
      match_format: parsed.data.match_format,
      venue_status: parsed.data.venue_status,
      travel_willingness: parsed.data.travel_willingness,
      preferred_date: parsed.data.preferred_date,
      preferred_time: parsed.data.preferred_time,
      status: "open",
    });

    if (error) {
      return {
        message: "We couldn't publish that request right now. Please try again.",
        values,
      };
    }
  } catch {
    return {
      message: "We couldn't publish that request right now. Please try again.",
      values,
    };
  }

  revalidatePath("/dashboard");
  revalidatePath("/matches");
  redirect("/dashboard?message=fixture-posted");
}
