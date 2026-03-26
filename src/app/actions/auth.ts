"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ensureProfile } from "@/lib/supabase/profile";
import type { FormState } from "@/lib/form-state";
import { pickFormValues, signInSchema, signUpSchema } from "@/lib/validation";

const signUpFields = ["full_name", "email"] as const;
const signInFields = ["email"] as const;

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

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        data: {
          full_name: parsed.data.full_name,
        },
      },
    });

    if (error) {
      return {
        message: getAuthErrorMessage(error.message),
        values,
      };
    }

    if (!data.user) {
      return {
        message: "We couldn't create your account. Please try again.",
        values,
      };
    }

    if (data.session) {
      await ensureProfile(supabase, data.user, {
        email: parsed.data.email,
        fullName: parsed.data.full_name,
      });
      revalidatePath("/", "layout");
      redirect(next);
    }

    const adminClient = createAdminClient();

    if (adminClient) {
      await ensureProfile(adminClient, data.user, {
        email: parsed.data.email,
        fullName: parsed.data.full_name,
      });
    }

    revalidatePath("/", "layout");
    redirect(
      `/login?message=confirm-email&email=${encodeURIComponent(parsed.data.email)}`,
    );
  } catch {
    return {
      message: "We hit a problem while creating your account. Please try again.",
      values,
    };
  }
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

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    });

    if (error) {
      return {
        message: getAuthErrorMessage(error.message),
        values,
      };
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await ensureProfile(supabase, user, {
        email: parsed.data.email,
      });
    }

    revalidatePath("/", "layout");
    redirect(next);
  } catch {
    return {
      message: "We couldn't log you in right now. Please try again.",
      values,
    };
  }
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
