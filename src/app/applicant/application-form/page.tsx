import type { Metadata } from "next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpen,
  faChevronRight,
  faCircleInfo,
  faClipboardCheck,
  faEye,
  faGraduationCap,
  faIdCard,
  faPrint,
  faSave,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

export const metadata: Metadata = {
  title: "Application Form | TESDA E-Forms Portal",
  description: "TESDA E-Forms applicant application form.",
};

const steps = ["Personal Info", "Education", "Qualification", "Experience", "Checklist"];

const requirements = [
  {
    title: "Duly Accomplished Application Form",
    detail: "2 copies, original",
  },
  {
    title: "Passport Size ID Photos",
    detail: "3 pcs, white background, with name tag",
  },
  {
    title: "Self-Assessment Guide (SAG)",
    detail: "Duly accomplished and signed",
  },
  {
    title: "Photocopy of NSO/PSA Birth Certificate",
    detail: "Validated copy",
  },
];

function Field({
  label,
  children,
}: Readonly<{
  label: string;
  children: React.ReactNode;
}>) {
  return (
    <label className="space-y-2">
      <span className="block text-sm font-semibold text-on-surface-variant">{label}</span>
      {children}
    </label>
  );
}

function TextInput({
  placeholder,
  type = "text",
}: Readonly<{
  placeholder?: string;
  type?: string;
}>) {
  return (
    <input
      className="w-full rounded-lg border border-outline-variant bg-white p-4 text-base text-on-surface outline-none transition-colors placeholder:text-outline focus:border-primary focus:ring-1 focus:ring-primary"
      placeholder={placeholder}
      type={type}
    />
  );
}

function SelectInput({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <select className="w-full rounded-lg border border-outline-variant bg-white p-4 text-base text-on-surface outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary">
      {children}
    </select>
  );
}

function FormSection({
  icon,
  title,
  children,
}: Readonly<{
  icon: typeof faUser;
  title: string;
  children: React.ReactNode;
}>) {
  return (
    <section>
      <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-3">
        <FontAwesomeIcon aria-hidden="true" className="h-5 w-5 text-primary" icon={icon} />
        <h2 className="text-2xl font-semibold text-primary">{title}</h2>
      </div>
      {children}
    </section>
  );
}

export default function ApplicationFormPage() {
  return (
    <>
      <section className="space-y-8">
        <div className="space-y-4">
          <nav aria-label="Breadcrumb" className="text-sm text-secondary">
            <ol className="flex flex-wrap items-center gap-2">
              <li>Application Form</li>
              <li>
                <FontAwesomeIcon aria-hidden="true" className="h-3 w-3" icon={faChevronRight} />
              </li>
              <li className="font-semibold text-primary">Competency Assessment</li>
            </ol>
          </nav>

          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-primary">
              Application for Competency Assessment
            </h1>
            <div className="flex gap-4 border-l-4 border-blue-600 bg-blue-50 p-4">
              <FontAwesomeIcon aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-blue-600" icon={faCircleInfo} />
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> This online form is for encoding and printing purposes only.
                Final submission must be done physically at the{" "}
                <span className="font-bold">TESDA Eastern Samar Provincial Office</span>.
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto pb-2">
          <div className="relative flex min-w-3xl items-start justify-between gap-6">
            <div className="absolute left-5 right-5 top-5 -z-0 h-px bg-slate-200" />
            {steps.map((step, index) => {
              const isActive = index === 0;
              const isCurrent = index === 1;

              return (
                <div className="relative z-10 flex min-w-24 flex-col items-center gap-2" key={step}>
                  <div
                    className={
                      isActive
                        ? "flex h-10 w-10 items-center justify-center rounded-full bg-primary font-bold text-white shadow-md"
                        : isCurrent
                          ? "flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary bg-white font-bold text-primary"
                          : "flex h-10 w-10 items-center justify-center rounded-full border-2 border-slate-200 bg-white font-bold text-slate-400"
                    }
                  >
                    {index + 1}
                  </div>
                  <span
                    className={
                      isActive || isCurrent
                        ? "text-center text-sm font-semibold text-primary"
                        : "text-center text-sm font-semibold text-slate-400"
                    }
                  >
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
        <form className="space-y-12">
          <FormSection icon={faUser} title="Personal Information">
            <div className="grid gap-6 md:grid-cols-3">
              <Field label="Last Name">
                <TextInput placeholder="e.g. Dela Cruz" />
              </Field>
              <Field label="First Name">
                <TextInput placeholder="e.g. Juan" />
              </Field>
              <Field label="Middle Name">
                <TextInput placeholder="Leave blank if N/A" />
              </Field>
              <Field label="Birth Date">
                <TextInput type="date" />
              </Field>
              <Field label="Sex">
                <SelectInput>
                  <option value="">Select Sex</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </SelectInput>
              </Field>
              <Field label="Civil Status">
                <SelectInput>
                  <option value="">Select Status</option>
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="widowed">Widowed</option>
                </SelectInput>
              </Field>
            </div>
          </FormSection>

          <FormSection icon={faIdCard} title="Contact Information">
            <div className="mb-6 grid gap-6 md:grid-cols-2">
              <Field label="Mobile Number">
                <TextInput placeholder="09XX-XXX-XXXX" type="tel" />
              </Field>
              <Field label="Email Address">
                <TextInput placeholder="name@example.com" type="email" />
              </Field>
            </div>
            <Field label="Permanent Address">
              <textarea
                className="w-full rounded-lg border border-outline-variant bg-white p-4 text-base text-on-surface outline-none transition-colors placeholder:text-outline focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="House No., Street, Barangay, City/Municipality, Province"
                rows={3}
              />
            </Field>
          </FormSection>

          <FormSection icon={faGraduationCap} title="Educational Background">
            <div className="grid gap-6 md:grid-cols-2">
              <Field label="Highest Educational Attainment">
                <SelectInput>
                  <option value="">Select Attainment</option>
                  <option value="elementary">Elementary Graduate</option>
                  <option value="highschool">High School Graduate</option>
                  <option value="tvet">TVET Graduate</option>
                  <option value="college">College Graduate</option>
                  <option value="postgraduate">Post-Graduate</option>
                </SelectInput>
              </Field>
              <Field label="School Name / Training Center">
                <TextInput placeholder="e.g. Eastern Samar State University" />
              </Field>
            </div>
          </FormSection>

          <FormSection icon={faClipboardCheck} title="Qualification Applied For">
            <div className="grid gap-6 md:grid-cols-2">
              <Field label="Title of Qualification">
                <SelectInput>
                  <option value="">Select Qualification</option>
                  <option value="it">Computer Systems Servicing NC II</option>
                  <option value="food">Cookery NC II</option>
                  <option value="driving">Driving NC II</option>
                  <option value="welding">Shielded Metal Arc Welding (SMAW) NC I</option>
                </SelectInput>
              </Field>
              <div className="space-y-2">
                <span className="block text-sm font-semibold text-on-surface-variant">
                  Type of Assessment
                </span>
                <div className="flex flex-col gap-4 rounded-lg border border-outline-variant p-4 sm:flex-row sm:items-center">
                  <label className="flex items-center gap-2">
                    <input className="accent-primary" name="assessment_type" type="radio" />
                    <span className="text-sm">Full Qualification</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input className="accent-primary" name="assessment_type" type="radio" />
                    <span className="text-sm">Certificate of Competency (COC)</span>
                  </label>
                </div>
              </div>
            </div>
          </FormSection>

          <FormSection icon={faBookOpen} title="Requirements Checklist">
            <p className="mb-4 text-sm italic text-secondary">
              Please confirm you have these ready for physical submission:
            </p>
            <div className="grid gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 md:grid-cols-2">
              {requirements.map((requirement) => (
                <label
                  className="flex items-start gap-3 rounded p-2 transition-colors hover:bg-white"
                  key={requirement.title}
                >
                  <input className="mt-1 accent-primary" type="checkbox" />
                  <span className="space-y-1">
                    <span className="block font-semibold text-on-surface">
                      {requirement.title}
                    </span>
                    <span className="block text-xs text-secondary">{requirement.detail}</span>
                  </span>
                </label>
              ))}
            </div>
          </FormSection>

          <div className="flex flex-col gap-4 border-t border-slate-200 pt-8 md:flex-row md:items-center md:justify-between">
            <button
              className="order-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border-2 border-slate-300 px-6 py-4 font-semibold text-slate-600 transition-colors hover:bg-slate-50 md:order-1 md:w-auto"
              type="button"
            >
              <FontAwesomeIcon aria-hidden="true" className="h-4 w-4" icon={faSave} />
              Save Draft
            </button>

            <div className="order-1 flex w-full flex-col gap-4 md:order-2 md:w-auto md:flex-row">
              <button
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border-2 border-primary px-6 py-4 font-semibold text-primary transition-colors hover:bg-blue-50 md:w-auto"
                type="button"
              >
                <FontAwesomeIcon aria-hidden="true" className="h-4 w-4" icon={faEye} />
                Review Application
              </button>
              <button
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-8 py-4 font-semibold text-white shadow-md transition-colors hover:bg-primary-container md:w-auto"
                type="submit"
              >
                <FontAwesomeIcon aria-hidden="true" className="h-4 w-4" icon={faPrint} />
                Submit for Printing
              </button>
            </div>
          </div>
        </form>
      </section>

      <section className="rounded-lg border border-blue-100 bg-blue-50 p-4 lg:hidden">
        <p className="text-center text-xs text-blue-800">
          Reminder: This portal is for data encoding. Physical submission at Eastern Samar
          Provincial Office is mandatory.
        </p>
      </section>
    </>
  );
}
