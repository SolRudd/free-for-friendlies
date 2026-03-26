"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { signUp } from "@/app/actions/auth";
import { EMPTY_FORM_STATE } from "@/lib/form-state";
import { Input } from "@/components/ui/input";
import { FieldError } from "@/components/forms/field-error";
import { FormAlert } from "@/components/forms/form-alert";
import { SubmitButton } from "@/components/forms/submit-button";

export function SignUpForm() {
  const searchParams = useSearchParams();
  const [state, formAction] = useActionState(signUp, EMPTY_FORM_STATE);
  const next = searchParams.get("next") ?? "/dashboard";

  const fullNameError = state.fieldErrors?.full_name?.[0];
  const emailError = state.fieldErrors?.email?.[0];
  const passwordError = state.fieldErrors?.password?.[0];

  return (
    <form action={formAction} className="space-y-5" noValidate>
      <input type="hidden" name="next" value={next} />

      {state.message ? <FormAlert>{state.message}</FormAlert> : null}

      <div>
        <label
          htmlFor="signup-full-name"
          className="mb-2 block text-sm font-medium text-[var(--foreground)]"
        >
          Full name
        </label>
        <Input
          id="signup-full-name"
          name="full_name"
          autoComplete="name"
          required
          defaultValue={state.values?.full_name ?? ""}
          aria-invalid={Boolean(fullNameError)}
          aria-describedby={fullNameError ? "signup-full-name-error" : undefined}
          placeholder="Jordan Smith"
        />
        <FieldError id="signup-full-name-error" error={fullNameError} />
      </div>

      <div>
        <label
          htmlFor="signup-email"
          className="mb-2 block text-sm font-medium text-[var(--foreground)]"
        >
          Email
        </label>
        <Input
          id="signup-email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          defaultValue={state.values?.email ?? ""}
          aria-invalid={Boolean(emailError)}
          aria-describedby={emailError ? "signup-email-error" : undefined}
          placeholder="fixtures@club.com"
        />
        <FieldError id="signup-email-error" error={emailError} />
      </div>

      <div>
        <label
          htmlFor="signup-password"
          className="mb-2 block text-sm font-medium text-[var(--foreground)]"
        >
          Password
        </label>
        <Input
          id="signup-password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          aria-invalid={Boolean(passwordError)}
          aria-describedby={passwordError ? "signup-password-error" : undefined}
          placeholder="At least 8 characters"
        />
        <FieldError id="signup-password-error" error={passwordError} />
      </div>

      <SubmitButton pendingText="Creating account..." className="w-full" size="lg">
        Create account
      </SubmitButton>

      <p className="text-sm text-[var(--muted)]">
        Already registered?{" "}
        <Link className="font-semibold text-[var(--accent)]" href="/login">
          Log in
        </Link>
        .
      </p>
    </form>
  );
}
