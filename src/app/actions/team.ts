"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils/slugify";
import type { FormState } from "@/lib/form-state";
import { emptyToNull, pickFormValues, teamSchema } from "@/lib/validation";

const teamFields = [
  "name",
  "city",
  "area",
  "age_group",
  "skill_level",
  "preferred_match_day",
  "contact_email",
  "bio",
] as const;

async function generateTeamSlug(
  baseName: string,
  supabase: Awaited<ReturnType<typeof createClient>>,
) {
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

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        message: "Your session has expired. Log in again and retry.",
        values,
      };
    }

    const slug = await generateTeamSlug(parsed.data.name, supabase);

    const { error } = await supabase.from("teams").insert({
      owner_id: user.id,
      name: parsed.data.name,
      slug,
      city: parsed.data.city,
      area: emptyToNull(parsed.data.area ?? ""),
      bio: emptyToNull(parsed.data.bio ?? ""),
      age_group: parsed.data.age_group,
      skill_level: parsed.data.skill_level,
      preferred_match_day: parsed.data.preferred_match_day,
      contact_email: parsed.data.contact_email,
      is_active: true,
    });

    if (error) {
      return {
        message:
          error.message.toLowerCase().includes("foreign key")
            ? "We couldn't find your profile row. Log out and back in, then try again."
            : "We couldn't save that team right now. Please try again.",
        values,
      };
    }

    revalidatePath("/dashboard");
    revalidatePath("/teams");
    redirect("/dashboard");
  } catch {
    return {
      message: "We couldn't save that team right now. Please try again.",
      values,
    };
  }
}
