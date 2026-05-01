import type { User } from "@supabase/supabase-js";

export type ApplicantProfile = {
  email: string;
  firstName: string;
  middleName: string;
  surname: string;
  fullName: string;
};

function getMetadataValue(user: User, key: string) {
  const value = user.user_metadata[key];

  return typeof value === "string" ? value.trim() : "";
}

function formatMiddleInitial(middleName: string) {
  return middleName ? `${middleName.charAt(0).toUpperCase()}.` : "";
}

export function getApplicantProfile(user: User): ApplicantProfile {
  const firstName = getMetadataValue(user, "first_name");
  const middleName = getMetadataValue(user, "middle_name");
  const surname = getMetadataValue(user, "surname");
  const metadataFullName = getMetadataValue(user, "full_name");
  const formattedName = [firstName, formatMiddleInitial(middleName), surname]
    .filter(Boolean)
    .join(" ");
  const fullName =
    formattedName ||
    metadataFullName ||
    user.email ||
    "Applicant";

  return {
    email: user.email ?? "",
    firstName,
    middleName,
    surname,
    fullName,
  };
}

export function getApplicantFirstName(profile: ApplicantProfile) {
  return profile.firstName || profile.fullName.split(" ")[0] || "Applicant";
}
