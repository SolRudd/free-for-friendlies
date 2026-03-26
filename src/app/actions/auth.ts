"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ensureProfile } from "@/lib/supabase/profile";
import type { FormState } from "@/lib/form-state";
import { pickFormValues, signInSchema, signUpSchema } from "@/lib/validation";

const signUpFields = ["full_name", "email"] as const;
const signInFields = ["email"] as const;

type ProfileSyncResult = {
  status: "success" | "deferred" | "failed";
  strategy: "session" | "admin" | "session-then-admin" | "deferred";
  errorMessage?: string;
};

function getSafeNext(nextValue: FormDataEntryValue | null) {
  const nextPath = String(nextValue ?? "").trim();
  return nextPath.startsWith("/dashboard") ? nextPath : "/dashboard";
}

function getAuthErrorMessage(message: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes("invalid login credentials")) {
    return "Email or password is incorrect.";
  }

  if (normalized.includes("email not confirmed")) {
    return "Confirm your email address before logging in.";
  }

  if (normalized.includes("user already registered")) {
    return "An account already exists for this email. Log in instead.";
  }

  if (normalized.includes("rate limit")) {
    return "Too many attempts. Wait a moment and try again.";
  }

  return message;
}

function getLogError(error: unknown) {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
    };
  }

  return {
    message: String(error),
  };
}

function logAuthInfo(event: string, details: Record<string, unknown>) {
  console.info(`[auth] ${event}`, details);
}

function logAuthWarn(event: string, details: Record<string, unknown>) {
  console.warn(`[auth] ${event}`, details);
}

function logAuthError(
  event: string,
  error: unknown,
  details: Record<string, unknown> = {},
) {
  console.error(`[auth] ${event}`, {
    ...details,
    error: getLogError(error),
  });
}

function buildLoginRedirect({
  message,
  email,
  next,
}: {
  message: string;
  email: string;
  next: string;
}) {
  const params = new URLSearchParams({
    message,
    email,
    next,
  });

  return `/login?${params.toString()}`;
}

async function upsertProfileWithLogging({
  client,
  user,
  email,
  fullName,
  event,
  strategy,
}: {
  client: SupabaseClient;
  user: User;
  email: string;
  fullName?: string;
  event: "signUp" | "signIn";
  strategy: "session" | "admin";
}) {
  logAuthInfo(`${event}.profile.upsert.start`, {
    userId: user.id,
    email,
    strategy,
  });

  const result = await ensureProfile(client, user, {
    email,
    fullName,
  });

  if (result.error) {
    logAuthWarn(`${event}.profile.upsert.failed`, {
      userId: user.id,
      email,
      strategy,
      error: result.error.message,
      code: result.error.code,
    });
  } else {
    logAuthInfo(`${event}.profile.upsert.success`, {
      userId: user.id,
      email,
      strategy,
    });
  }

  return result;
}

async function syncProfileAfterSignUp({
  supabase,
  user,
  email,
  fullName,
  hasSession,
}: {
  supabase: SupabaseClient;
  user: User;
  email: string;
  fullName: string;
  hasSession: boolean;
}): Promise<ProfileSyncResult> {
  let sessionErrorMessage: string | undefined;

  if (hasSession) {
    const sessionResult = await upsertProfileWithLogging({
      client: supabase,
      user,
      email,
      fullName,
      event: "signUp",
      strategy: "session",
    });

    if (!sessionResult.error) {
      return {
        status: "success",
        strategy: "session",
      };
    }

    sessionErrorMessage = sessionResult.error.message;
  }

  const adminClient = createAdminClient();

  if (!adminClient) {
    if (hasSession) {
      return {
        status: "failed",
        strategy: "session",
        errorMessage: sessionErrorMessage,
      };
    }

    logAuthInfo("signUp.profile.upsert.deferred", {
      userId: user.id,
      email,
      reason: "missing_service_role_key",
    });

    return {
      status: "deferred",
      strategy: "deferred",
    };
  }

  const adminResult = await upsertProfileWithLogging({
    client: adminClient,
    user,
    email,
    fullName,
    event: "signUp",
    strategy: "admin",
  });

  if (!adminResult.error) {
    return {
      status: "success",
      strategy: hasSession ? "session-then-admin" : "admin",
    };
  }

  return {
    status: "failed",
    strategy: hasSession ? "session-then-admin" : "admin",
    errorMessage: adminResult.error.message,
  };
}

async function syncProfileAfterSignIn({
  supabase,
  user,
  email,
}: {
  supabase: SupabaseClient;
  user: User;
  email: string;
}) {
  const sessionResult = await upsertProfileWithLogging({
    client: supabase,
    user,
    email,
    event: "signIn",
    strategy: "session",
  });

  if (!sessionResult.error) {
    return;
  }

  const adminClient = createAdminClient();

  if (!adminClient) {
    logAuthInfo("signIn.profile.upsert.deferred", {
      userId: user.id,
      email,
      reason: "missing_service_role_key",
    });
    return;
  }

  await upsertProfileWithLogging({
    client: adminClient,
    user,
    email,
    event: "signIn",
    strategy: "admin",
  });
}

export async function signUp(
  _previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  const values = pickFormValues(formData, signUpFields);
  const password = String(formData.get("password") ?? "");
  const next = getSafeNext(formData.get("next"));

  const parsed = signUpSchema.safeParse({
    ...values,
    password,
  });

  if (!parsed.success) {
    return {
      message: "Please check the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
      values,
    };
  }

  logAuthInfo("signUp.start", {
    email: parsed.data.email,
    next,
  });

  let supabase: SupabaseClient;

  try {
    supabase = await createClient();
  } catch (error) {
    logAuthError("signUp.client.failed", error, {
      email: parsed.data.email,
    });

    return {
      message: "We couldn't start signup right now. Please try again.",
      values,
    };
  }

  let signUpResult: Awaited<ReturnType<typeof supabase.auth.signUp>>;

  try {
    signUpResult = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        data: {
          full_name: parsed.data.full_name,
        },
      },
    });
  } catch (error) {
    logAuthError("signUp.request.threw", error, {
      email: parsed.data.email,
    });

    return {
      message: "We couldn't create your account right now. Please try again.",
      values,
    };
  }

  const { data, error } = signUpResult;

  logAuthInfo("signUp.result", {
    email: parsed.data.email,
    userId: data.user?.id ?? null,
    sessionPresent: Boolean(data.session),
    error: error?.message ?? null,
  });

  if (error) {
    return {
      message: getAuthErrorMessage(error.message),
      values,
    };
  }

  if (!data.user) {
    logAuthWarn("signUp.user.missing", {
      email: parsed.data.email,
    });

    return {
      message: "We couldn't create your account. Please try again.",
      values,
    };
  }

  let profileSync: ProfileSyncResult;

  try {
    profileSync = await syncProfileAfterSignUp({
      supabase,
      user: data.user,
      email: parsed.data.email,
      fullName: parsed.data.full_name,
      hasSession: Boolean(data.session),
    });
  } catch (error) {
    logAuthError("signUp.profile.unexpected", error, {
      email: parsed.data.email,
      userId: data.user.id,
      sessionPresent: Boolean(data.session),
    });

    profileSync = {
      status: "failed",
      strategy: data.session ? "session" : "admin",
      errorMessage: "Unexpected profile sync failure.",
    };
  }

  logAuthInfo("signUp.profile.result", {
    email: parsed.data.email,
    userId: data.user.id,
    status: profileSync.status,
    strategy: profileSync.strategy,
    error: profileSync.errorMessage ?? null,
  });

  revalidatePath("/", "layout");

  if (data.session) {
    logAuthInfo("signUp.redirect", {
      email: parsed.data.email,
      userId: data.user.id,
      target: next,
      sessionPresent: true,
      profileStatus: profileSync.status,
    });

    redirect(next);
  }

  const loginMessage =
    profileSync.status === "failed"
      ? "account-created-profile-warning"
      : profileSync.status === "deferred"
        ? "account-created-profile-pending"
        : "account-created";

  const loginRedirect = buildLoginRedirect({
    message: loginMessage,
    email: parsed.data.email,
    next,
  });

  logAuthInfo("signUp.redirect", {
    email: parsed.data.email,
    userId: data.user.id,
    target: loginRedirect,
    sessionPresent: false,
    profileStatus: profileSync.status,
  });

  redirect(loginRedirect);
}

export async function signIn(
  _previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  const values = pickFormValues(formData, signInFields);
  const password = String(formData.get("password") ?? "");
  const next = getSafeNext(formData.get("next"));

  const parsed = signInSchema.safeParse({
    ...values,
    password,
  });

  if (!parsed.success) {
    return {
      message: "Please check the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
      values,
    };
  }

  logAuthInfo("signIn.start", {
    email: parsed.data.email,
    next,
  });

  let supabase: SupabaseClient;

  try {
    supabase = await createClient();
  } catch (error) {
    logAuthError("signIn.client.failed", error, {
      email: parsed.data.email,
    });

    return {
      message: "We couldn't start login right now. Please try again.",
      values,
    };
  }

  let signInResult: Awaited<ReturnType<typeof supabase.auth.signInWithPassword>>;

  try {
    signInResult = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    });
  } catch (error) {
    logAuthError("signIn.request.threw", error, {
      email: parsed.data.email,
    });

    return {
      message: "We couldn't log you in right now. Please try again.",
      values,
    };
  }

  const { data, error } = signInResult;

  logAuthInfo("signIn.result", {
    email: parsed.data.email,
    userId: data.user?.id ?? null,
    sessionPresent: Boolean(data.session),
    error: error?.message ?? null,
  });

  if (error) {
    return {
      message: getAuthErrorMessage(error.message),
      values,
    };
  }

  const user = data.user;

  if (user) {
    try {
      await syncProfileAfterSignIn({
        supabase,
        user,
        email: parsed.data.email,
      });
    } catch (profileError) {
      logAuthError("signIn.profile.unexpected", profileError, {
        email: parsed.data.email,
        userId: user.id,
      });
    }
  }

  revalidatePath("/", "layout");

  logAuthInfo("signIn.redirect", {
    email: parsed.data.email,
    userId: user?.id ?? null,
    target: next,
  });

  redirect(next);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
