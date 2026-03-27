import { createAdminClient } from "@/lib/supabase/admin";
import { TEAM_LOGO_BUCKET } from "@/lib/team";
import { slugify } from "@/lib/utils/slugify";

const MAX_TEAM_LOGO_SIZE = 2 * 1024 * 1024;
const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export function getTeamLogoFile(value: FormDataEntryValue | null) {
  if (!(value instanceof File) || value.size === 0) {
    return { file: null as File | null };
  }

  if (!allowedMimeTypes.has(value.type)) {
    return {
      error: "Use a PNG, JPG, WEBP, or GIF file for the team crest.",
      file: null as File | null,
    };
  }

  if (value.size > MAX_TEAM_LOGO_SIZE) {
    return {
      error: "Team crest files must be under 2MB.",
      file: null as File | null,
    };
  }

  return {
    file: value,
  };
}

function getFileExtension(file: File) {
  const fromName = file.name.split(".").pop()?.toLowerCase();

  if (fromName) {
    return fromName;
  }

  switch (file.type) {
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    default:
      return "jpg";
  }
}

export async function uploadTeamLogo({
  file,
  ownerId,
  teamId,
  teamName,
}: {
  file: File;
  ownerId: string;
  teamId: string;
  teamName: string;
}) {
  if (file.size === 0) {
    return { url: null as string | null };
  }

  const fileState = getTeamLogoFile(file);

  if (fileState.error) {
    return {
      error: fileState.error,
    };
  }

  const adminClient = createAdminClient();

  if (!adminClient) {
    return {
      error:
        "Team crest uploads require SUPABASE_SERVICE_ROLE_KEY and a public 'team-assets' storage bucket.",
    };
  }

  const extension = getFileExtension(file);
  const safeTeamName = slugify(teamName) || "team";
  const path = `teams/${ownerId}/${teamId}/${safeTeamName}-${Date.now()}.${extension}`;

  const bytes = Buffer.from(await file.arrayBuffer());
  const { error } = await adminClient.storage
    .from(TEAM_LOGO_BUCKET)
    .upload(path, bytes, {
      contentType: file.type,
      upsert: true,
    });

  if (error) {
    return {
      error:
        "The crest could not be uploaded. Check that the 'team-assets' bucket exists and is public.",
    };
  }

  const { data } = adminClient.storage.from(TEAM_LOGO_BUCKET).getPublicUrl(path);

  return {
    url: data.publicUrl,
  };
}
