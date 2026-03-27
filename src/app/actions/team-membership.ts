"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TEAM_APPROVED_MEMBER_LIMIT } from "@/lib/team";
import { joinTeamSchema, reviewJoinRequestSchema } from "@/lib/validation";

export async function requestToJoinTeam(formData: FormData) {
  const parsed = joinTeamSchema.safeParse({
    team_id: String(formData.get("team_id") ?? "").trim(),
  });

  if (!parsed.success) {
    redirect("/teams?message=join-request-error");
  }

  const supabase = await createClient();

  if (!supabase) {
    redirect("/teams?message=join-request-error");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?message=join-team&next=/teams");
  }

  const teamId = parsed.data.team_id;

  const [
    { data: targetTeam, error: targetTeamError },
    { data: existingOwnedTeam },
    { data: existingMemberships, error: membershipsError },
    approvedMembersResponse,
  ] = await Promise.all([
    supabase
      .from("teams")
      .select("id, owner_id, is_active")
      .eq("id", teamId)
      .maybeSingle(),
    supabase
      .from("teams")
      .select("id")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("team_members")
      .select("team_id, status")
      .eq("user_id", user.id),
    supabase
      .from("team_members")
      .select("id", { count: "exact", head: true })
      .eq("team_id", teamId)
      .eq("status", "approved"),
  ]);

  if (targetTeamError || !targetTeam || !targetTeam.is_active) {
    redirect("/teams?message=join-request-error");
  }

  if (existingOwnedTeam) {
    redirect("/teams?message=already-managing-team");
  }

  if (targetTeam.owner_id === user.id) {
    redirect("/teams?message=team-owner");
  }

  if (membershipsError) {
    redirect("/teams?message=join-request-error");
  }

  const existingMembership = (existingMemberships ?? []).find(
    (membership) => membership.team_id === teamId,
  );

  if (existingMembership?.status === "pending") {
    redirect("/teams?message=join-request-pending");
  }

  if (existingMembership?.status === "approved") {
    redirect("/teams?message=already-squad-member");
  }

  const existingSquad = (existingMemberships ?? []).find(
    (membership) =>
      membership.team_id !== teamId &&
      (membership.status === "pending" || membership.status === "approved"),
  );

  if (existingSquad) {
    redirect("/teams?message=existing-squad");
  }

  if ((approvedMembersResponse.count ?? 0) >= TEAM_APPROVED_MEMBER_LIMIT) {
    redirect("/teams?message=squad-full");
  }

  const { error } = await supabase.from("team_members").insert({
    team_id: teamId,
    user_id: user.id,
    status: "pending",
  });

  if (error) {
    if (error.code === "23505") {
      redirect("/teams?message=join-request-pending");
    }

    redirect("/teams?message=join-request-error");
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/team");
  revalidatePath("/teams");
  redirect("/teams?message=join-request-sent");
}

export async function reviewJoinRequest(formData: FormData) {
  const parsed = reviewJoinRequestSchema.safeParse({
    membership_id: String(formData.get("membership_id") ?? "").trim(),
    decision: String(formData.get("decision") ?? "").trim(),
  });

  if (!parsed.success) {
    redirect("/dashboard?message=join-review-error");
  }

  const supabase = await createClient();

  if (!supabase) {
    redirect("/dashboard?message=join-review-error");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?message=session-expired&next=/dashboard");
  }

  const { data: membership, error: membershipError } = await supabase
    .from("team_members")
    .select("id, team_id, status")
    .eq("id", parsed.data.membership_id)
    .maybeSingle();

  if (membershipError || !membership || membership.status !== "pending") {
    redirect("/dashboard?message=join-review-error");
  }

  if (parsed.data.decision === "approve") {
    const { count } = await supabase
      .from("team_members")
      .select("id", { count: "exact", head: true })
      .eq("team_id", membership.team_id)
      .eq("status", "approved");

    if ((count ?? 0) >= TEAM_APPROVED_MEMBER_LIMIT) {
      redirect("/dashboard?message=squad-full");
    }
  }

  const { error } = await supabase
    .from("team_members")
    .update({
      status: parsed.data.decision === "approve" ? "approved" : "rejected",
      approved_at:
        parsed.data.decision === "approve"
          ? new Date().toISOString()
          : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", membership.id);

  if (error) {
    redirect("/dashboard?message=join-review-error");
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/team");
  revalidatePath("/teams");
  redirect(
    `/dashboard?message=${parsed.data.decision === "approve" ? "join-approved" : "join-rejected"}`,
  );
}
