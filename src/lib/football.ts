export const TEAM_FORMAT_OPTIONS = [
  "5-a-side",
  "6-a-side",
  "7-a-side",
  "9-a-side",
  "11-a-side",
] as const;

export const PITCH_STATUS_OPTIONS = [
  "Have a home pitch",
  "Can host on some dates",
  "Usually need opposition pitch",
  "Flexible on venue",
] as const;

export const TRAVEL_WILLINGNESS_OPTIONS = [
  "Home area only",
  "Short trips are fine",
  "Happy to travel for the right fixture",
] as const;

export const VENUE_STATUS_OPTIONS = [
  "Home pitch available",
  "Need opposition pitch",
  "Can host or travel",
  "Away fixture preferred",
] as const;

function isDefinedString(value: string | null | undefined): value is string {
  return Boolean(value);
}

export function getUniqueFilterOptions(values: (string | null | undefined)[]) {
  return [...new Set(values.map((value) => value?.trim()).filter(isDefinedString))].sort(
    (left, right) => left.localeCompare(right),
  );
}
