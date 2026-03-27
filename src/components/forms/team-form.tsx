"use client";

import { useActionState } from "react";
import { createTeam, updateTeam } from "@/app/actions/team";
import { FieldError } from "@/components/forms/field-error";
import { FormAlert } from "@/components/forms/form-alert";
import { SubmitButton } from "@/components/forms/submit-button";
import { TeamBadge } from "@/components/team/team-badge";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EMPTY_FORM_STATE } from "@/lib/form-state";
import {
  PITCH_STATUS_OPTIONS,
  TEAM_FORMAT_OPTIONS,
  TRAVEL_WILLINGNESS_OPTIONS,
} from "@/lib/football";

type TeamFormValues = {
  id?: string;
  name?: string;
  city?: string;
  area?: string | null;
  age_group?: string;
  skill_level?: string;
  team_format?: string;
  preferred_match_day?: string;
  pitch_status?: string;
  travel_willingness?: string;
  contact_email?: string | null;
  bio?: string | null;
  logo_url?: string | null;
};

type TeamFormProps = {
  allowLogoUpload?: boolean;
  defaultContactEmail?: string;
  initialValues?: TeamFormValues;
  mode?: "create" | "update";
};

export function TeamForm({
  allowLogoUpload = false,
  defaultContactEmail = "",
  initialValues,
  mode = "create",
}: TeamFormProps) {
  const action = mode === "create" ? createTeam : updateTeam;
  const [state, formAction] = useActionState(action, EMPTY_FORM_STATE);
  const getError = (field: string) => state.fieldErrors?.[field]?.[0];
  const resolvedValues = {
    name: state.values?.name ?? initialValues?.name ?? "",
    city: state.values?.city ?? initialValues?.city ?? "",
    area: state.values?.area ?? initialValues?.area ?? "",
    age_group: state.values?.age_group ?? initialValues?.age_group ?? "",
    skill_level: state.values?.skill_level ?? initialValues?.skill_level ?? "",
    team_format: state.values?.team_format ?? initialValues?.team_format ?? "",
    preferred_match_day:
      state.values?.preferred_match_day ??
      initialValues?.preferred_match_day ??
      "",
    pitch_status:
      state.values?.pitch_status ?? initialValues?.pitch_status ?? "",
    travel_willingness:
      state.values?.travel_willingness ??
      initialValues?.travel_willingness ??
      "",
    contact_email:
      state.values?.contact_email ??
      initialValues?.contact_email ??
      defaultContactEmail,
    bio: state.values?.bio ?? initialValues?.bio ?? "",
  };
  const teamFormatOptions = resolvedValues.team_format &&
    !TEAM_FORMAT_OPTIONS.includes(
      resolvedValues.team_format as (typeof TEAM_FORMAT_OPTIONS)[number],
    )
    ? [resolvedValues.team_format, ...TEAM_FORMAT_OPTIONS]
    : [...TEAM_FORMAT_OPTIONS];
  const pitchStatusOptions = resolvedValues.pitch_status &&
    !PITCH_STATUS_OPTIONS.includes(
      resolvedValues.pitch_status as (typeof PITCH_STATUS_OPTIONS)[number],
    )
    ? [resolvedValues.pitch_status, ...PITCH_STATUS_OPTIONS]
    : [...PITCH_STATUS_OPTIONS];
  const travelOptions = resolvedValues.travel_willingness &&
    !TRAVEL_WILLINGNESS_OPTIONS.includes(
      resolvedValues.travel_willingness as (typeof TRAVEL_WILLINGNESS_OPTIONS)[number],
    )
    ? [resolvedValues.travel_willingness, ...TRAVEL_WILLINGNESS_OPTIONS]
    : [...TRAVEL_WILLINGNESS_OPTIONS];

  return (
    <form
      action={formAction}
      className="space-y-5"
      encType="multipart/form-data"
      noValidate
    >
      {mode === "update" ? (
        <input type="hidden" name="team_id" value={initialValues?.id ?? ""} />
      ) : null}

      {state.message ? <FormAlert>{state.message}</FormAlert> : null}

      <div className="grid gap-5 md:grid-cols-[auto_1fr]">
        <div className="rounded-[1.75rem] border border-[color:var(--border)] bg-[var(--surface)] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
            Team crest
          </p>
          <div className="mt-4 flex items-center gap-4">
            <TeamBadge
              name={resolvedValues.name || "Team"}
              logoUrl={initialValues?.logo_url ?? undefined}
              size="lg"
            />
            <div className="space-y-2">
              <p className="text-sm font-semibold text-[var(--foreground)]">
                {resolvedValues.name || "Your team"}
              </p>
              <p className="max-w-xs text-xs leading-6 text-[var(--muted)]">
                Use a simple square crest so the directory and dashboard stay
                easy to scan.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-[color:var(--border)] bg-[var(--surface)] p-5">
          <label
            htmlFor="team-logo"
            className="mb-2 block text-sm font-medium text-[var(--foreground)]"
          >
            Upload team crest
          </label>
          <Input
            id="team-logo"
            name="logo_file"
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            disabled={!allowLogoUpload}
            aria-describedby="team-logo-hint"
          />
          <p id="team-logo-hint" className="mt-2 text-sm text-[var(--muted)]">
            {allowLogoUpload
              ? "Optional. PNG, JPG, WEBP, or GIF up to 2MB."
              : "Logo uploads are disabled until SUPABASE_SERVICE_ROLE_KEY and a public 'team-assets' bucket are configured."}
          </p>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label
            htmlFor="team-name"
            className="mb-2 block text-sm font-medium text-[var(--foreground)]"
          >
            Team name
          </label>
          <Input
            id="team-name"
            name="name"
            required
            defaultValue={resolvedValues.name}
            aria-invalid={Boolean(getError("name"))}
            aria-describedby={getError("name") ? "team-name-error" : undefined}
            placeholder="Southend Saturday XI"
          />
          <FieldError id="team-name-error" error={getError("name")} />
        </div>

        <div>
          <label
            htmlFor="team-city"
            className="mb-2 block text-sm font-medium text-[var(--foreground)]"
          >
            City
          </label>
          <Input
            id="team-city"
            name="city"
            required
            defaultValue={resolvedValues.city}
            aria-invalid={Boolean(getError("city"))}
            aria-describedby={getError("city") ? "team-city-error" : undefined}
            placeholder="Southend"
          />
          <FieldError id="team-city-error" error={getError("city")} />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label
            htmlFor="team-area"
            className="mb-2 block text-sm font-medium text-[var(--foreground)]"
          >
            Area
          </label>
          <Input
            id="team-area"
            name="area"
            defaultValue={resolvedValues.area ?? ""}
            aria-invalid={Boolean(getError("area"))}
            aria-describedby={getError("area") ? "team-area-error" : undefined}
            placeholder="Leigh / Chalkwell / Westcliff"
          />
          <FieldError id="team-area-error" error={getError("area")} />
        </div>

        <div>
          <label
            htmlFor="team-age-group"
            className="mb-2 block text-sm font-medium text-[var(--foreground)]"
          >
            Age group
          </label>
          <Input
            id="team-age-group"
            name="age_group"
            required
            defaultValue={resolvedValues.age_group}
            aria-invalid={Boolean(getError("age_group"))}
            aria-describedby={
              getError("age_group") ? "team-age-group-error" : undefined
            }
            placeholder="Open age"
          />
          <FieldError id="team-age-group-error" error={getError("age_group")} />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div>
          <label
            htmlFor="team-skill-level"
            className="mb-2 block text-sm font-medium text-[var(--foreground)]"
          >
            Skill level
          </label>
          <Input
            id="team-skill-level"
            name="skill_level"
            required
            defaultValue={resolvedValues.skill_level}
            aria-invalid={Boolean(getError("skill_level"))}
            aria-describedby={
              getError("skill_level") ? "team-skill-level-error" : undefined
            }
            placeholder="Intermediate"
          />
          <FieldError
            id="team-skill-level-error"
            error={getError("skill_level")}
          />
        </div>

        <div>
          <label
            htmlFor="team-format"
            className="mb-2 block text-sm font-medium text-[var(--foreground)]"
          >
            Main format
          </label>
          <Select
            id="team-format"
            name="team_format"
            required
            defaultValue={resolvedValues.team_format}
            aria-invalid={Boolean(getError("team_format"))}
            aria-describedby={
              getError("team_format") ? "team-format-error" : "team-format-hint"
            }
          >
            <option value="">Select format</option>
            {teamFormatOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
          <p id="team-format-hint" className="mt-2 text-sm text-[var(--muted)]">
            The regular format your side is built around.
          </p>
          <FieldError id="team-format-error" error={getError("team_format")} />
        </div>

        <div>
          <label
            htmlFor="team-preferred-match-day"
            className="mb-2 block text-sm font-medium text-[var(--foreground)]"
          >
            Preferred match day
          </label>
          <Input
            id="team-preferred-match-day"
            name="preferred_match_day"
            required
            defaultValue={resolvedValues.preferred_match_day}
            aria-invalid={Boolean(getError("preferred_match_day"))}
            aria-describedby={
              getError("preferred_match_day")
                ? "team-preferred-match-day-error"
                : undefined
            }
            placeholder="Sunday mornings"
          />
          <FieldError
            id="team-preferred-match-day-error"
            error={getError("preferred_match_day")}
          />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label
            htmlFor="team-pitch-status"
            className="mb-2 block text-sm font-medium text-[var(--foreground)]"
          >
            Pitch situation
          </label>
          <Select
            id="team-pitch-status"
            name="pitch_status"
            required
            defaultValue={resolvedValues.pitch_status}
            aria-invalid={Boolean(getError("pitch_status"))}
            aria-describedby={
              getError("pitch_status")
                ? "team-pitch-status-error"
                : "team-pitch-status-hint"
            }
          >
            <option value="">Select pitch situation</option>
            {pitchStatusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
          <p
            id="team-pitch-status-hint"
            className="mt-2 text-sm text-[var(--muted)]"
          >
            Tell organisers whether you can host or need a pitch.
          </p>
          <FieldError
            id="team-pitch-status-error"
            error={getError("pitch_status")}
          />
        </div>

        <div>
          <label
            htmlFor="team-travel-willingness"
            className="mb-2 block text-sm font-medium text-[var(--foreground)]"
          >
            Travel willingness
          </label>
          <Select
            id="team-travel-willingness"
            name="travel_willingness"
            required
            defaultValue={resolvedValues.travel_willingness}
            aria-invalid={Boolean(getError("travel_willingness"))}
            aria-describedby={
              getError("travel_willingness")
                ? "team-travel-willingness-error"
                : "team-travel-willingness-hint"
            }
          >
            <option value="">Select travel range</option>
            {travelOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
          <p
            id="team-travel-willingness-hint"
            className="mt-2 text-sm text-[var(--muted)]"
          >
            Helps other teams judge whether the fixture is realistic.
          </p>
          <FieldError
            id="team-travel-willingness-error"
            error={getError("travel_willingness")}
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="team-contact-email"
          className="mb-2 block text-sm font-medium text-[var(--foreground)]"
        >
          Contact email
        </label>
        <Input
          id="team-contact-email"
          name="contact_email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          defaultValue={resolvedValues.contact_email}
          aria-invalid={Boolean(getError("contact_email"))}
          aria-describedby={
            getError("contact_email")
              ? "team-contact-email-error"
              : "team-contact-email-hint"
          }
          placeholder="fixtures@club.com"
        />
        <p
          id="team-contact-email-hint"
          className="mt-2 text-sm text-[var(--muted)]"
        >
          This is the main contact shown for friendly coordination.
        </p>
        <FieldError
          id="team-contact-email-error"
          error={getError("contact_email")}
        />
      </div>

      <div>
        <label
          htmlFor="team-bio"
          className="mb-2 block text-sm font-medium text-[var(--foreground)]"
        >
          Team bio
        </label>
        <Textarea
          id="team-bio"
          name="bio"
          defaultValue={resolvedValues.bio ?? ""}
          aria-invalid={Boolean(getError("bio"))}
          aria-describedby={getError("bio") ? "team-bio-error" : "team-bio-hint"}
          placeholder="Share your level, home area, ideal opposition, and what kind of friendlies you want."
        />
        <p id="team-bio-hint" className="mt-2 text-sm text-[var(--muted)]">
          Keep it short and useful. This shows on the public team directory.
        </p>
        <FieldError id="team-bio-error" error={getError("bio")} />
      </div>

      <SubmitButton
        pendingText={mode === "create" ? "Creating team..." : "Saving team..."}
        size="lg"
      >
        {mode === "create" ? "Create team" : "Save changes"}
      </SubmitButton>
    </form>
  );
}
