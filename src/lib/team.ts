export const TEAM_MEMBER_LIMIT = 11;
export const TEAM_APPROVED_MEMBER_LIMIT = TEAM_MEMBER_LIMIT - 1;
export const TEAM_LOGO_BUCKET = "team-assets";

export function getRegisteredSquadCount(approvedMembers: number) {
  return approvedMembers + 1;
}

export function getRemainingSquadPlaces(approvedMembers: number) {
  return Math.max(TEAM_APPROVED_MEMBER_LIMIT - approvedMembers, 0);
}

export function getTeamInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
