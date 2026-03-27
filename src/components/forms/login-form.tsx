"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "@/app/actions/auth";
import { EMPTY_FORM_STATE } from "@/lib/form-state";
import { Input } from "@/components/ui/input";
import { FieldError } from "@/components/forms/field-error";
import { FormAlert } from "@/components/forms/form-alert";
import { SubmitButton } from "@/components/forms/submit-button";

function getMessage(messageKey: string | null) {
  if (messageKey === "account-created") {
    return "Account created. If your project requires email confirmation, check your inbox, then log in.";
  }

  if (messageKey === "account-created-profile-pending") {
    return "Account created. If email confirmation is enabled, confirm your email first. Your profile will be completed on your first successful login.";
  }

  if (messageKey === "account-created-profile-warning") {
    return "Account created, but profile setup could not be completed yet. Log in once the account is active and the app will retry profile setup.";
  }

  if (messageKey === "confirm-email") {
    return "Check your inbox, confirm your email if needed, then log in.";
  }

  if (messageKey === "session-expired") {
    return "Your session expired. Log back in to continue.";
  }

  if (messageKey === "join-team") {
    return "Log in to request a place in a squad.";
  }

  return "";
}

export function LoginForm() {
  const searchParams = useSearchParams();
  const [state, formAction] = useActionState(signIn, EMPTY_FORM_STATE);
  const infoMessage = getMessage(searchParams.get("message"));
  const emailFromSearch = searchParams.get("email") ?? "";
  const next = searchParams.get("next") ?? "/dashboard";

  const emailError = state.fieldErrors?.email?.[0];
  const passwordError = state.fieldErrors?.password?.[0];

  return (
    <form action={formAction} className="space-y-5" noValidate>
      <input type="hidden" name="next" value={next} />

      {infoMessage ? <FormAlert tone="info">{infoMessage}</FormAlert> : null}
      {state.message ? <FormAlert>{state.message}</FormAlert> : null}

      <div>
        <label
          htmlFor="login-email"
          className="mb-2 block text-sm font-medium text-[var(--foreground)]"
        >
          Email
        </label>
        <Input
          id="login-email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          defaultValue={state.values?.email ?? emailFromSearch}
          aria-invalid={Boolean(emailError)}
          aria-describedby={emailError ? "login-email-error" : undefined}
          placeholder="fixtures@club.com"
        />
        <FieldError id="login-email-error" error={emailError} />
      </div>

      <div>
        <label
          htmlFor="login-password"
          className="mb-2 block text-sm font-medium text-[var(--foreground)]"
        >
          Password
        </label>
        <Input
          id="login-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          aria-invalid={Boolean(passwordError)}
          aria-describedby={passwordError ? "login-password-error" : undefined}
          placeholder="Your password"
        />
        <FieldError id="login-password-error" error={passwordError} />
      </div>

      <SubmitButton pendingText="Logging in..." className="w-full" size="lg">
        Log in
      </SubmitButton>

      <p className="text-sm text-[var(--muted)]">
        Need an account?{" "}
        <Link className="font-semibold text-[var(--accent)]" href="/signup">
          Create one here
        </Link>
        .
      </p>
    </form>
  );
}
