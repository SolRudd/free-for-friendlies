"use client";

import { useSearchParams } from "next/navigation";
import { FormAlert } from "@/components/forms/form-alert";

export function DashboardNotice() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");
  const team = searchParams.get("team");

  if (message !== "team-created") {
    return null;
  }

  return (
    <FormAlert tone="info">
      {team
        ? `${team} is live in your account. You can post a friendly request or review the public directory below.`
        : "Your team is live in your account. You can post a friendly request or review the public directory below."}
    </FormAlert>
  );
}
