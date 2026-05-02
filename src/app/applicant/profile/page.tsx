import type { Metadata } from "next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faIdCard,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { redirect } from "next/navigation";
import { getApplicantProfile } from "@/lib/applicant-profile";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Profile | TESDA E-Forms Portal",
  description: "Applicant profile information for TESDA E-Forms Portal.",
};

function DetailItem({
  label,
  value,
}: Readonly<{
  label: string;
  value: string;
}>) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <p className="text-sm font-bold uppercase tracking-widest text-secondary">{label}</p>
      <p className="mt-2 text-sm font-semibold text-on-surface">{value || "Not provided"}</p>
    </div>
  );
}

export default async function ProfilePage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/");
  }

  const profile = getApplicantProfile(user);

  return (
    <>
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:p-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-center">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-blue-50 text-primary">
            <FontAwesomeIcon aria-hidden="true" className="h-14 w-14 scale-125" icon={faUser} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold uppercase tracking-widest text-secondary">
              Applicant Profile
            </p>
            <h1 className="mt-2 break-words text-3xl font-bold leading-tight text-primary">
              {profile.fullName}
            </h1>
            <p className="mt-2 flex items-center gap-2 text-sm leading-6 text-secondary">
              <FontAwesomeIcon aria-hidden="true" className="h-4 w-4" icon={faEnvelope} />
              {profile.email || "No email address"}
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:p-6">
        <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-3">
          <FontAwesomeIcon aria-hidden="true" className="h-5 w-5 text-primary" icon={faIdCard} />
          <h2 className="text-xl font-semibold text-primary">Account Information</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <DetailItem label="First Name" value={profile.firstName} />
          <DetailItem label="Middle Name" value={profile.middleName} />
          <DetailItem label="Surname" value={profile.surname} />
          <DetailItem label="Email Address" value={profile.email} />
        </div>
      </section>
    </>
  );
}
