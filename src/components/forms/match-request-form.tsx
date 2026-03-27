"use client";

import { useActionState } from "react";
import { createMatchRequest } from "@/app/actions/match";
import { FieldError } from "@/components/forms/field-error";
import { FormAlert } from "@/components/forms/form-alert";
import { SubmitButton } from "@/components/forms/submit-button";
import { TeamBadge } from "@/components/team/team-badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { EMPTY_FORM_STATE } from "@/lib/form-state";
import {
  TEAM_FORMAT_OPTIONS,
  TRAVEL_WILLINGNESS_OPTIONS,
  VENUE_STATUS_OPTIONS,
} from "@/lib/football";

type TeamOption = {
  id: string;
  name: string;
  logo_url?: string | null;
  city?: string | null;
  area?: string | null;
};

type MatchRequestFormProps = {
  team?: TeamOption | null;
  teams?: TeamOption[];
};

export function MatchRequestForm({
  team = null,
  teams = [],
}: MatchRequestFormProps) {
  const [state, formAction] = useActionState(createMatchRequest, EMPTY_FORM_STATE);
  const getError = (field: string) => state.fieldErrors?.[field]?.[0];

  return (
    <form action={formAction} className="space-y-5" noValidate>
      {state.message ? <FormAlert>{state.message}</FormAlert> : null}

      {team ? (
        <div className="rounded-[1.75rem] border border-[color:var(--border)] bg-[var(--surface)] p-5">
          <input type="hidden" name="team_id" value={team.id} />
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
            Posting as
          </p>
          <div className="mt-4 flex items-center gap-4">
            <TeamBadge
              name={team.name}
              logoUrl={team.logo_url ?? undefined}
              size="md"
            />
            <div>
              <p className="text-base font-semibold text-[var(--foreground)]">
                {team.name}
              </p>
              <p className="text-sm text-[var(--muted)]">
                {[team.city, team.area].filter(Boolean).join(" · ") ||
                  "Location pending"}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <label
            htmlFor="match-team"
            className="mb-2 block text-sm font-medium text-[var(--foreground)]"
          >
            Team
          </label>
          <Select
            id="match-team"
            name="team_id"
            required
            defaultValue={state.values?.team_id ?? ""}
            aria-invalid={Boolean(getError("team_id"))}
            aria-describedby={getError("team_id") ? "match-team-error" : undefined}
          >
            <option value="">Select your team</option>
            {teams.map((teamOption) => (
              <option key={teamOption.id} value={teamOption.id}>
                {teamOption.name}
              </option>
            ))}
          </Select>
          <FieldError id="match-team-error" error={getError("team_id")} />
        </div>
      )}

      <div>
        <label
          htmlFor="match-title"
          className="mb-2 block text-sm font-medium text-[var(--foreground)]"
        >
          Fixture title
        </label>
        <Input
          id="match-title"
          name="title"
          required
          defaultValue={state.values?.title ?? ""}
          aria-invalid={Boolean(getError("title"))}
          aria-describedby={getError("title") ? "match-title-error" : "match-title-hint"}
          placeholder="Opponent wanted for open-age Sunday slot"
        />
        <p id="match-title-hint" className="mt-2 text-sm text-[var(--muted)]">
          Make the fixture need obvious at a glance.
        </p>
        <FieldError id="match-title-error" error={getError("title")} />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label
            htmlFor="match-city"
            className="mb-2 block text-sm font-medium text-[var(--foreground)]"
          >
            City
          </label>
          <Input
            id="match-city"
            name="city"
            required
            defaultValue={state.values?.city ?? ""}
            aria-invalid={Boolean(getError("city"))}
            aria-describedby={getError("city") ? "match-city-error" : undefined}
            placeholder="Southend"
          />
          <FieldError id="match-city-error" error={getError("city")} />
        </div>

        <div>
          <label
            htmlFor="match-area"
            className="mb-2 block text-sm font-medium text-[var(--foreground)]"
          >
            Area
          </label>
          <Input
            id="match-area"
            name="area"
            defaultValue={state.values?.area ?? ""}
            aria-invalid={Boolean(getError("area"))}
            aria-describedby={getError("area") ? "match-area-error" : undefined}
            placeholder="Essex coast"
          />
          <FieldError id="match-area-error" error={getError("area")} />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label
            htmlFor="match-age-group"
            className="mb-2 block text-sm font-medium text-[var(--foreground)]"
          >
            Age group
          </label>
          <Input
            id="match-age-group"
            name="age_group"
            required
            defaultValue={state.values?.age_group ?? ""}
            aria-invalid={Boolean(getError("age_group"))}
            aria-describedby={
              getError("age_group") ? "match-age-group-error" : undefined
            }
            placeholder="Open age"
          />
          <FieldError id="match-age-group-error" error={getError("age_group")} />
        </div>

        <div>
          <label
            htmlFor="match-skill-level"
            className="mb-2 block text-sm font-medium text-[var(--foreground)]"
          >
            Skill level
          </label>
          <Input
            id="match-skill-level"
            name="skill_level"
            required
            defaultValue={state.values?.skill_level ?? ""}
            aria-invalid={Boolean(getError("skill_level"))}
            aria-describedby={
              getError("skill_level") ? "match-skill-level-error" : undefined
            }
            placeholder="Intermediate"
          />
          <FieldError
            id="match-skill-level-error"
            error={getError("skill_level")}
          />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div>
          <label
            htmlFor="match-format"
            className="mb-2 block text-sm font-medium text-[var(--foreground)]"
          >
            Match format
          </label>
          <Select
            id="match-format"
            name="match_format"
            required
            defaultValue={state.values?.match_format ?? ""}
            aria-invalid={Boolean(getError("match_format"))}
            aria-describedby={
              getError("match_format") ? "match-format-error" : undefined
            }
          >
            <option value="">Select format</option>
            {TEAM_FORMAT_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
          <FieldError id="match-format-error" error={getError("match_format")} />
        </div>

        <div>
          <label
            htmlFor="match-venue-status"
            className="mb-2 block text-sm font-medium text-[var(--foreground)]"
          >
            Venue status
          </label>
          <Select
            id="match-venue-status"
            name="venue_status"
            required
            defaultValue={state.values?.venue_status ?? ""}
            aria-invalid={Boolean(getError("venue_status"))}
            aria-describedby={
              getError("venue_status") ? "match-venue-status-error" : undefined
            }
          >
            <option value="">Select venue status</option>
            {VENUE_STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
          <FieldError
            id="match-venue-status-error"
            error={getError("venue_status")}
          />
        </div>

        <div>
          <label
            htmlFor="match-preferred-time"
            className="mb-2 block text-sm font-medium text-[var(--foreground)]"
          >
            Preferred time
          </label>
          <Input
            id="match-preferred-time"
            name="preferred_time"
            required
            defaultValue={state.values?.preferred_time ?? ""}
            aria-invalid={Boolean(getError("preferred_time"))}
            aria-describedby={
              getError("preferred_time") ? "match-preferred-time-error" : undefined
            }
            placeholder="10:30"
          />
          <FieldError
            id="match-preferred-time-error"
            error={getError("preferred_time")}
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="match-travel-willingness"
          className="mb-2 block text-sm font-medium text-[var(--foreground)]"
        >
          Travel willingness
        </label>
        <Select
          id="match-travel-willingness"
          name="travel_willingness"
          required
          defaultValue={state.values?.travel_willingness ?? ""}
          aria-invalid={Boolean(getError("travel_willingness"))}
          aria-describedby={
            getError("travel_willingness")
              ? "match-travel-willingness-error"
              : "match-travel-willingness-hint"
          }
        >
          <option value="">Select travel range</option>
          {TRAVEL_WILLINGNESS_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
        <p
          id="match-travel-willingness-hint"
          className="mt-2 text-sm text-[var(--muted)]"
        >
          Make it clear whether you expect home, away, or a local compromise.
        </p>
        <FieldError
          id="match-travel-willingness-error"
          error={getError("travel_willingness")}
        />
      </div>

      <div>
        <label
          htmlFor="match-preferred-date"
          className="mb-2 block text-sm font-medium text-[var(--foreground)]"
        >
          Preferred date
        </label>
        <Input
          id="match-preferred-date"
          name="preferred_date"
          type="date"
          required
          defaultValue={state.values?.preferred_date ?? ""}
          aria-invalid={Boolean(getError("preferred_date"))}
          aria-describedby={
            getError("preferred_date") ? "match-preferred-date-error" : undefined
          }
        />
        <FieldError
          id="match-preferred-date-error"
          error={getError("preferred_date")}
        />
      </div>

      <div>
        <label
          htmlFor="match-description"
          className="mb-2 block text-sm font-medium text-[var(--foreground)]"
        >
          Fixture notes
        </label>
        <Textarea
          id="match-description"
          name="description"
          defaultValue={state.values?.description ?? ""}
          aria-invalid={Boolean(getError("description"))}
          aria-describedby={
            getError("description")
              ? "match-description-error"
              : "match-description-hint"
          }
          placeholder="Share the kind of opponent you want, whether officials are arranged, and any key matchday details."
        />
        <p id="match-description-hint" className="mt-2 text-sm text-[var(--muted)]">
          Optional, but stronger detail usually brings better fixture responses.
        </p>
        <FieldError id="match-description-error" error={getError("description")} />
      </div>

      <SubmitButton pendingText="Publishing request..." size="lg">
        Publish request
      </SubmitButton>
    </form>
  );
}
