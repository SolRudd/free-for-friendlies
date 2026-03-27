"use client";

import { useSearchParams } from "next/navigation";
import { FormAlert } from "@/components/forms/form-alert";

function getMessage(message: string | null) {
  switch (message) {
    case "join-request-sent":
      return {
        tone: "info" as const,
        copy: "Your join request is now in the team manager's dashboard.",
      };
    case "join-request-pending":
      return {
        tone: "info" as const,
        copy: "You already have a pending request with that team.",
      };
    case "already-squad-member":
      return {
        tone: "info" as const,
        copy: "You're already an approved squad member for that team.",
      };
    case "already-managing-team":
      return {
        tone: "error" as const,
        copy: "This prototype supports one managed team per account, so team owners can't request to join another squad.",
      };
    case "existing-squad":
      return {
        tone: "error" as const,
        copy: "You already have an active squad request or membership in this prototype.",
      };
    case "team-owner":
      return {
        tone: "info" as const,
        copy: "That's already your team.",
      };
    case "squad-full":
      return {
        tone: "error" as const,
        copy: "That squad is already full for this prototype.",
      };
    case "join-request-error":
      return {
        tone: "error" as const,
        copy: "The join request could not be processed. Try again in a moment.",
      };
    default:
      return null;
  }
}

export function TeamDirectoryNotice() {
  const searchParams = useSearchParams();
  const message = getMessage(searchParams.get("message"));

  if (!message) {
    return null;
  }

  return <FormAlert tone={message.tone}>{message.copy}</FormAlert>;
}
