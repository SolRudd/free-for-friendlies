"use client";

import { useActionState } from "react";
import { createTeam } from "@/app/actions/team";
import { EMPTY_FORM_STATE } from "@/lib/form-state";
import { FieldError } from "@/components/forms/field-error";
import { FormAlert } from "@/components/forms/form-alert";
import { SubmitButton } from "@/components/forms/submit-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type TeamFormProps = {
  defaultContactEmail?: string;
};

export function TeamForm({ defaultContactEmail = "" }: TeamFormProps) {
  const [state, formAction] = useActionState(createTeam, EMPTY_FORM_STATE);

  const getError = (field: string) => state.fieldErrors?.[field]?.[0];

  return (
    <form action={formAction} className="space-y-5" noValidate>
      {state.message ? <FormAlert>{state.message}</FormAlert> : null}

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="team-name" className="mb-2 block text-sm font-medium text-[var(--foreground)]">
            Team name
          </label>
          <Input
            id="team-name"
            name="name"
            required
            defaultValue={state.values?.name ?? ""}
            aria-invalid={Boolean(getError("name"))}
            aria-describedby={getError("name") ? "team-name-error" : undefined}
            placeholder="Southend Saturday XI"
          />
          <FieldError id="team-name-error" error={getError("name")} />
        </div>

        <div>
          <label htmlFor="team-city" className="mb-2 block text-sm font-medium text-[var(--foreground)]">
            City
          </label>
          <Input
            id="team-city"
            name="city"
            required
            defaultValue={state.values?.city ?? ""}
            aria-invalid={Boolean(getError("city"))}
            aria-describedby={getError("city") ? "team-city-error" : undefined}
            placeholder="Southend"
          />
          <FieldError id="team-city-error" error={getError("city")} />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="team-area" className="mb-2 block text-sm font-medium text-[var(--foreground)]">
            Area
          </label>
          <Input
            id="team-area"
            name="area"
            defaultValue={state.values?.area ?? ""}
            aria-invalid={Boolean(getError("area"))}
            aria-describedby={getError("area") ? "team-area-error" : undefined}
            placeholder="Leigh / Chalkwell / Westcliff"
          />
          <FieldError id="team-area-error" error={getError("area")} />
        </div>

        <div>
          <label htmlFor="team-age-group" className="mb-2 block text-sm font-medium text-[var(--foreground)]">
            Age group
          </label>
          <Input
            id="team-age-group"
            name="age_group"
            required
            defaultValue={state.values?.age_group ?? ""}
            aria-invalid={Boolean(getError("age_group"))}
            aria-describedby={getError("age_group") ? "team-age-group-error" : undefined}
            placeholder="Open age"
          />
          <FieldError id="team-age-group-error" error={getError("age_group")} />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="team-skill-level" className="mb-2 block text-sm font-medium text-[var(--foreground)]">
            Skill level
          </label>
          <Input
            id="team-skill-level"
            name="skill_level"
            required
            defaultValue={state.values?.skill_level ?? ""}
            aria-invalid={Boolean(getError("skill_level"))}
            aria-describedby={getError("skill_level") ? "team-skill-level-error" : undefined}
            placeholder="Intermediate"
          />
          <FieldError id="team-skill-level-error" error={getError("skill_level")} />
        </div>

        <div>
          <label htmlFor="team-preferred-match-day" className="mb-2 block text-sm font-medium text-[var(--foreground)]">
            Preferred match day
          </label>
          <Input
            id="team-preferred-match-day"
            name="preferred_match_day"
            required
            defaultValue={state.values?.preferred_match_day ?? ""}
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

      <div>
        <label htmlFor="team-contact-email" className="mb-2 block text-sm font-medium text-[var(--foreground)]">
          Contact email
        </label>
        <Input
          id="team-contact-email"
          name="contact_email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          defaultValue={state.values?.contact_email ?? defaultContactEmail}
          aria-invalid={Boolean(getError("contact_email"))}
          aria-describedby={
            getError("contact_email")
              ? "team-contact-email-error"
              : "team-contact-email-hint"
          }
          placeholder="fixtures@club.com"
        />
        <p id="team-contact-email-hint" className="mt-2 text-sm text-[var(--muted)]">
          This defaults to your account email so teams have a clear contact point.
        </p>
        <FieldError id="team-contact-email-error" error={getError("contact_email")} />
      </div>

      <div>
        <label htmlFor="team-bio" className="mb-2 block text-sm font-medium text-[var(--foreground)]">
          Team bio
        </label>
        <Textarea
          id="team-bio"
          name="bio"
          defaultValue={state.values?.bio ?? ""}
          aria-invalid={Boolean(getError("bio"))}
          aria-describedby={getError("bio") ? "team-bio-error" : "team-bio-hint"}
          placeholder="Share your level, home area, ideal opposition, and what kind of friendlies you want."
        />
        <p id="team-bio-hint" className="mt-2 text-sm text-[var(--muted)]">
          Keep it short and useful. This shows on the public team directory.
        </p>
        <FieldError id="team-bio-error" error={getError("bio")} />
      </div>

      <SubmitButton pendingText="Creating team..." size="lg">
        Create team
      </SubmitButton>
    </form>
  );
}
