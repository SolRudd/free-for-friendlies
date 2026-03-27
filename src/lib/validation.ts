import { z } from "zod";

export const signUpSchema = z.object({
  full_name: z.string().trim().min(2, "Enter your full name."),
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export const signInSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
});

export const teamSchema = z.object({
  name: z.string().trim().min(2, "Enter your team name."),
  city: z.string().trim().min(2, "Enter your city."),
  area: z.string().trim().optional(),
  age_group: z.string().trim().min(2, "Add an age group."),
  skill_level: z.string().trim().min(2, "Add a skill level."),
  team_format: z.string().trim().min(2, "Choose your main playing format."),
  preferred_match_day: z.string().trim().min(2, "Add your preferred match day."),
  pitch_status: z.string().trim().min(2, "Tell teams whether you can host."),
  travel_willingness: z.string().trim().min(2, "Tell teams how far you will travel."),
  contact_email: z.string().trim().email("Enter a valid contact email."),
  bio: z.string().trim().max(600, "Keep the bio under 600 characters.").optional(),
});

export const reviewJoinRequestSchema = z.object({
  membership_id: z.string().uuid("Select a valid join request."),
  decision: z.enum(["approve", "reject"]),
});

export const joinTeamSchema = z.object({
  team_id: z.string().uuid("Select a valid team."),
});

export const matchRequestSchema = z.object({
  team_id: z.string().uuid("Select a valid team."),
  title: z.string().trim().min(8, "Add a clearer match request title."),
  city: z.string().trim().min(2, "Enter your city."),
  area: z.string().trim().optional(),
  age_group: z.string().trim().min(2, "Add an age group."),
  skill_level: z.string().trim().min(2, "Add a skill level."),
  match_format: z.string().trim().min(2, "Add the match format."),
  venue_status: z.string().trim().min(2, "Choose the venue situation."),
  travel_willingness: z.string().trim().min(2, "Tell teams how far you can travel."),
  preferred_date: z.string().trim().min(1, "Choose a preferred date."),
  preferred_time: z.string().trim().min(2, "Add a preferred time."),
  description: z.string().trim().max(1200, "Keep the notes under 1200 characters.").optional(),
});

export function pickFormValues(formData: FormData, fields: readonly string[]) {
  return fields.reduce<Record<string, string>>((values, field) => {
    values[field] = String(formData.get(field) ?? "").trim();
    return values;
  }, {});
}

export function emptyToNull(value: string) {
  return value.trim() ? value.trim() : null;
}
