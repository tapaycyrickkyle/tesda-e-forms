import type { Metadata } from "next";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faBuildingColumns,
  faCircleInfo,
  faClipboardCheck,
  faDownload,
  faFileLines,
  faLocationDot,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import { getApplicantFirstName, getApplicantProfile } from "@/lib/applicant-profile";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Applicant Dashboard | TESDA E-Forms Portal",
  description: "Applicant dashboard for the TESDA E-Forms Portal.",
};

const processSteps = [
  {
    title: "Fill out online form",
    text: "Enter your personal information, educational background, and preferred course details.",
    icon: faPenToSquare,
  },
  {
    title: "Review details",
    text: "Verify all information provided. Incorrect details may lead to processing delays.",
    icon: faClipboardCheck,
  },
  {
    title: "Download or print form",
    text: "Generated forms must be printed on A4 paper for final submission.",
    icon: faDownload,
  },
  {
    title: "Submit physically",
    text: "Bring the signed form to the TESDA Eastern Samar Provincial Office for verification.",
    icon: faBuildingColumns,
  },
];

export default async function ApplicantPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const firstName = user
    ? getApplicantFirstName(getApplicantProfile(user))
    : "Applicant";

  return (
    <>
      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="p-5 lg:p-8">
          <div className="space-y-4 text-center md:text-left">
            <h1 className="text-3xl font-bold leading-tight text-primary">Welcome back, {firstName}!</h1>
            <p className="max-w-4xl text-base leading-7 text-secondary">
              Start your professional journey today. Complete your TESDA E-Forms application online
              and secure your vocational certification with Eastern Samar Provincial Office.
            </p>
            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-center md:justify-start">
              <Link
                className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary shadow-md transition-colors hover:bg-primary-container"
                href="/applicant/application-form"
              >
                Start Application
                <FontAwesomeIcon
                  aria-hidden="true"
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  icon={faArrowRight}
                />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-1">
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-6 flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold text-on-surface">Current Status</h2>
              <span className="rounded bg-surface-container px-2 py-1 text-sm font-bold uppercase text-secondary">
                Live
              </span>
            </div>

            <div className="flex flex-col items-center rounded-lg border border-dashed border-outline-variant bg-surface-container-low p-6 text-center">
              <FontAwesomeIcon aria-hidden="true" className="mb-3 h-12 w-12 text-outline" icon={faFileLines} />
              <p className="font-semibold text-on-surface-variant">No Active Application</p>
              <p className="mt-1 text-sm leading-6 text-secondary">
                You haven&apos;t submitted any forms for the current period.
              </p>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon aria-hidden="true" className="h-5 w-5 text-error" icon={faCircleInfo} />
                <p className="text-sm font-semibold text-on-surface">Deadline: Oct 30, 2024</p>
              </div>
              <div className="h-2 w-full rounded-full bg-surface-container">
                <div className="h-2 w-0 rounded-full bg-primary" />
              </div>
            </div>
          </section>

          <section className="rounded-lg bg-blue-900 p-5 text-white shadow-xl">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
              <FontAwesomeIcon aria-hidden="true" className="h-5 w-5" icon={faLocationDot} />
              Provincial Office
            </h2>
            <p className="mb-4 text-sm leading-6 text-blue-100">
              TESDA Eastern Samar
              <br />
              Brgy. Alang-alang, Borongan City
              <br />
              Eastern Samar, 6800
            </p>
            <div className="grid h-32 place-items-center rounded-lg border border-blue-700 bg-blue-800 text-blue-100">
              <FontAwesomeIcon aria-hidden="true" className="h-12 w-12 opacity-80" icon={faLocationDot} />
            </div>
          </section>
        </div>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2 lg:p-6">
          <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-primary">Application Process</h2>
              <p className="text-sm leading-6 text-secondary">Follow these steps to complete your submission</p>
            </div>
            <span className="w-fit rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-bold text-primary">
              4 STEPS TO GO
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {processSteps.map((step, index) => (
              <article
                className="relative rounded-lg border border-slate-100 p-5 transition-colors hover:border-primary/30 hover:bg-blue-50/40"
                key={step.title}
              >
                <div className="absolute -left-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white shadow-md">
                  {index + 1}
                </div>
                <div className="flex gap-4">
                  <div className="h-fit rounded-lg bg-white p-2 text-primary shadow-sm">
                    <FontAwesomeIcon aria-hidden="true" className="h-5 w-5" icon={step.icon} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-on-surface">{step.title}</h3>
                    <p className="text-sm leading-6 text-secondary">{step.text}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-5 flex gap-4 rounded-lg border border-outline-variant bg-surface-container-low p-4">
            <FontAwesomeIcon aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-primary" icon={faCircleInfo} />
            <p className="text-sm leading-6 italic text-on-surface-variant">
              Note: Online submission is only the first part of the process. Your application is not
              complete until the physical documents are received.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
