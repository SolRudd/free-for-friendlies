"use client";

import { useSearchParams } from "next/navigation";
import { FormAlert } from "@/components/forms/form-alert";

export function DashboardNotice() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");
  const team = searchParams.get("team");
  const showLogoWarning = searchParams.get("logo") === "warning";

  if (!message && !showLogoWarning) {
    return null;
  }

  if (showLogoWarning) {
    return (
      <FormAlert tone="info">
        Your team details were saved, but the crest upload did not complete.
        You can keep using the MVP without a logo, or configure the
        <code>team-assets</code> bucket and try again.
      </FormAlert>
    );
  }

  if (message === "team-created") {
    return (
      <FormAlert tone="info">
        {team
          ? `${team} is live in your account. You can post a friendly request or review the public directory below.`
          : "Your team is live in your account. You can post a friendly request or review the public directory below."}
      </FormAlert>
    );
  }

  if (message === "fixture-posted") {
    return (
      <FormAlert tone="info">
        Your fixture need is live on the board. Keep it current if the venue,
        date, or matchday details change.
      </FormAlert>
    );
  }

  if (message === "join-approved") {
    return (
      <FormAlert tone="info">
        The join request was approved and the squad list is now up to date.
      </FormAlert>
    );
  }

  if (message === "join-rejected") {
    return (
      <FormAlert tone="info">
        The join request was declined and removed from your pending queue.
      </FormAlert>
    );
  }

  if (message === "join-review-error") {
    return (
      <FormAlert>
        We couldn&apos;t update that join request just now. Refresh and try
        again.
      </FormAlert>
    );
  }

  if (message === "squad-full") {
    return (
      <FormAlert>
        Your prototype squad is already full. Reject or remove a member before
        approving another join request.
      </FormAlert>
    );
  }

  return null;
}
