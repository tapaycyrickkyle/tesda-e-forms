import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Application | TESDA E-Forms Portal",
  description: "TESDA E-Forms applicant application status.",
};

export default function MyApplicationPage() {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:p-6">
      <div className="max-w-3xl space-y-3">
        <h1 className="text-3xl font-bold leading-tight text-primary">My Application</h1>
        <p className="text-sm leading-6 text-secondary">
          Application records and submission status will appear here.
        </p>
      </div>
    </section>
  );
}
