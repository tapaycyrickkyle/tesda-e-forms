"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBriefcase,
  faCertificate,
  faChevronRight,
  faClipboardCheck,
  faGraduationCap,
  faIdCard,
  faPrint,
  faSave,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { downloadFilledApplicationPdf } from "@/lib/application-pdf";

type FormLanguage = "en" | "tl";

const translations = {
  en: {
    language: "Form Language",
    title: "Application for Competency Assessment",
    breadcrumbForm: "Application Form",
    breadcrumbCurrent: "Competency Assessment",
    stepCount: "Step",
    of: "of",
    saveDraft: "Save Draft",
    back: "Back",
    next: "Next",
    finish: "Finish",
    addEntry: "Add entry",
    removeEntry: "Remove",
    mobileReminder:
      "Reminder: This portal is for data encoding. Physical submission at Eastern Samar Provincial Office is mandatory.",
    steps: ["Assessment", "Profile", "Experience", "Training", "Credentials", "Admission"],
    stepDescriptions: [
      "School, assessment title, assessment type, and client category.",
      "Personal details, address, contact information, education, and employment.",
      "National Qualification-related work history.",
      "National Qualification-related trainings and seminars.",
      "Licensure, competency certificates, and other supporting information.",
      "Admission slip and assessment proceedings details.",
    ],
    sections: {
      assessmentDetails: "Assessment Details",
      clientType: "Client Type",
      profile: "Profile",
      workExperience: "Work Experience",
      training: "Other Training / Seminars Attended",
      licensure: "Licensure Examination(s) Passed",
      competency: "Competency Assessment(s) Passed",
      admissionSlip: "Admission Slip",
    },
    labels: {
      school: "Name of School / Training Center / Company",
      address: "Address",
      assessmentTitle: "Title of Assessment Applied For",
      assessmentType: "Assessment Type",
      surname: "Surname",
      firstName: "First Name",
      middleName: "Middle Name",
      middleInitial: "Middle Initial",
      nameExtension: "Name Extension",
      mailingAddress: "Mailing Address",
      motherName: "Mother's Name",
      fatherName: "Father's Name",
      sex: "Sex",
      civilStatus: "Civil Status",
      telephone: "Telephone Number",
      mobile: "Mobile Number",
      email: "Email Address",
      fax: "Fax",
      education: "Highest Educational Attainment",
      employment: "Employment Status",
      birthDate: "Birth Date",
      birthPlace: "Birth Place",
      age: "Age",
      applicantName: "Name of Applicant",
      admissionTel: "Tel. Number",
      admissionAssessment: "Assessment Applied For",
      officialReceiptNumber: "Official Receipt Number",
    },
    placeholders: {
      nameExtension: "e.g. Jr., Sr.",
      street: "Number, Street",
      barangay: "Barangay",
      district: "District",
      city: "City",
      province: "Province",
      region: "Region",
      zipCode: "Zip Code",
    },
    options: {
      assessmentTypes: ["Full Qualification", "COC", "Renewal"],
      clientTypes: [
        "TVET Graduating Student",
        "TVET Graduate",
        "Industry Worker",
        "K-12",
        "OFW",
      ],
      sex: ["Male", "Female"],
      civilStatus: ["Single", "Married", "Widow/er", "Separated", "Others"],
      education: [
        "Elementary Graduate",
        "High School Graduate",
        "TVET Graduate",
        "College Level",
        "College Graduate",
        "Others",
      ],
      employment: [
        "Casual",
        "Job Order",
        "Probationary",
        "Permanent",
        "Self-Employed",
        "OFW",
      ],
    },
    tableNotes: {
      workExperience: "National Qualification-related experience.",
      training: "National Qualification-related training.",
    },
    tableColumns: {
      workExperience: [
        "Name of Company",
        "Position",
        "Inclusive Dates",
        "Monthly Salary",
        "Status of Appointment",
        "No. of Yrs. Working Exp.",
      ],
      training: ["Title", "Venue", "Inclusive Dates", "No. of Hours", "Conducted By"],
      licensure: ["Title", "Year Taken", "Examination Venue", "Rating", "Remarks", "Expiry Date"],
      competency: [
        "Title",
        "Qualification Level",
        "Industry Sector",
        "Certificate Number",
        "Date of Issuance",
        "Expiration Date",
      ],
    },
  },
  tl: {
    language: "Wika ng Form",
    title: "Aplikasyon para sa Competency Assessment",
    breadcrumbForm: "Application Form",
    breadcrumbCurrent: "Competency Assessment",
    stepCount: "Hakbang",
    of: "ng",
    saveDraft: "I-save ang Draft",
    back: "Bumalik",
    next: "Susunod",
    finish: "Tapusin",
    addEntry: "Magdagdag ng entry",
    removeEntry: "Tanggalin",
    mobileReminder:
      "Paalala: Ang portal na ito ay para sa pag-encode ng datos. Kailangang isumite pa rin nang personal sa TESDA Eastern Samar Provincial Office.",
    steps: ["Assessment", "Profile", "Karanasan", "Pagsasanay", "Kredensyal", "Admission"],
    stepDescriptions: [
      "Paaralan o training center, assessment na ina-applyan, uri ng assessment, at client type.",
      "Personal na detalye, tirahan, contact information, edukasyon, at trabaho.",
      "Karanasan sa trabaho na may kaugnayan sa National Qualification.",
      "Mga training at seminar na may kaugnayan sa National Qualification.",
      "Licensure, competency certificates, at iba pang karagdagang impormasyon.",
      "Admission slip at detalye ng assessment proceedings.",
    ],
    sections: {
      assessmentDetails: "Detalye ng Assessment",
      clientType: "Uri ng Kliyente",
      profile: "Profile",
      workExperience: "Karanasan sa Trabaho",
      training: "Ibang Training / Seminar na Nadaluhan",
      licensure: "Naipasang Licensure Examination",
      competency: "Naipasang Competency Assessment",
      admissionSlip: "Admission Slip",
    },
    labels: {
      school: "Pangalan ng Paaralan / Training Center / Kumpanya",
      address: "Address",
      assessmentTitle: "Pamagat ng Assessment na Ina-applyan",
      assessmentType: "Uri ng Assessment",
      surname: "Apelyido",
      firstName: "Pangalan",
      middleName: "Gitnang Pangalan",
      middleInitial: "Middle Initial",
      nameExtension: "Name Extension",
      mailingAddress: "Mailing Address",
      motherName: "Pangalan ng Ina",
      fatherName: "Pangalan ng Ama",
      sex: "Kasarian",
      civilStatus: "Civil Status",
      telephone: "Telephone Number",
      mobile: "Mobile Number",
      email: "Email Address",
      fax: "Fax",
      education: "Pinakamataas na Natapos",
      employment: "Employment Status",
      birthDate: "Petsa ng Kapanganakan",
      birthPlace: "Lugar ng Kapanganakan",
      age: "Edad",
      applicantName: "Pangalan ng Aplikante",
      admissionTel: "Tel. Number",
      admissionAssessment: "Assessment na Ina-applyan",
      officialReceiptNumber: "Official Receipt Number",
    },
    placeholders: {
      nameExtension: "hal. Jr., Sr.",
      street: "Numero, Kalye",
      barangay: "Barangay",
      district: "Distrito",
      city: "Lungsod / Bayan",
      province: "Probinsya",
      region: "Rehiyon",
      zipCode: "Zip Code",
    },
    options: {
      assessmentTypes: ["Full Qualification", "COC", "Renewal"],
      clientTypes: [
        "TVET Graduating Student",
        "TVET Graduate",
        "Industry Worker",
        "K-12",
        "OFW",
      ],
      sex: ["Lalaki", "Babae"],
      civilStatus: ["Single", "May Asawa", "Biyudo/Biyuda", "Hiwalay", "Iba pa"],
      education: [
        "Elementary Graduate",
        "High School Graduate",
        "TVET Graduate",
        "College Level",
        "College Graduate",
        "Iba pa",
      ],
      employment: [
        "Casual",
        "Job Order",
        "Probationary",
        "Permanent",
        "Self-Employed",
        "OFW",
      ],
    },
    tableNotes: {
      workExperience: "Karanasan na may kaugnayan sa National Qualification.",
      training: "Training na may kaugnayan sa National Qualification.",
    },
    tableColumns: {
      workExperience: [
        "Pangalan ng Kumpanya",
        "Posisyon",
        "Inclusive Dates",
        "Buwanang Sahod",
        "Status of Appointment",
        "Bilang ng Taon ng Karanasan",
      ],
      training: ["Pamagat", "Lugar", "Inclusive Dates", "Bilang ng Oras", "Conducted By"],
      licensure: ["Pamagat", "Taon Kinuha", "Lugar ng Exam", "Rating", "Remarks", "Expiry Date"],
      competency: [
        "Pamagat",
        "Qualification Level",
        "Industry Sector",
        "Certificate Number",
        "Petsa ng Pag-isyu",
        "Expiration Date",
      ],
    },
  },
} as const;

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
  name,
  placeholder,
  type = "text",
}: Readonly<{
  name?: string;
  placeholder?: string;
  type?: string;
}>) {
  const shouldUppercase = type === "text";

  return (
    <input
      className="min-h-11 w-full rounded-lg border border-outline-variant bg-white px-3 py-2.5 text-base leading-6 text-on-surface outline-none transition-colors placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary/25"
      name={name}
      onInput={
        shouldUppercase
          ? (event) => {
              event.currentTarget.value = event.currentTarget.value.toUpperCase();
            }
          : undefined
      }
      placeholder={placeholder}
      style={shouldUppercase ? { textTransform: "uppercase" } : undefined}
      type={type}
    />
  );
}

function RadioOption({
  className = "",
  label,
  name,
}: Readonly<{
  className?: string;
  label: string;
  name: string;
}>) {
  return (
    <label
      className={`flex min-h-10 items-center gap-2 rounded-lg border border-outline-variant bg-white px-3 py-2 ${className}`}
    >
      <input className="accent-primary" name={name} type="radio" value={label} />
      <span className="text-sm leading-5 text-on-surface">{label}</span>
    </label>
  );
}

function OptionGroup({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{children}</div>;
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
      <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-3">
        <FontAwesomeIcon aria-hidden="true" className="h-5 w-5 text-primary" icon={icon} />
        <h2 className="text-xl font-semibold text-primary">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function FieldGroup({
  children,
  className = "",
}: Readonly<{
  children: React.ReactNode;
  className?: string;
}>) {
  return <div className={`border-t border-slate-200 pt-6 ${className}`}>{children}</div>;
}

function EntryGroups({
  addLabel,
  count,
  fields,
  onAdd,
  onRemove,
  removeLabel,
  name,
}: Readonly<{
  addLabel: string;
  count: number;
  fields: readonly string[];
  onAdd: () => void;
  onRemove: () => void;
  removeLabel: string;
  name: string;
}>) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }, (_, entryIndex) => (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4" key={entryIndex}>
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-sm font-bold uppercase text-secondary">
              Entry {entryIndex + 1}
            </p>
            {entryIndex > 0 && entryIndex === count - 1 ? (
              <button
                className="min-h-11 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-white hover:text-error"
                onClick={onRemove}
                type="button"
              >
                {removeLabel}
              </button>
            ) : null}
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {fields.map((field, fieldIndex) => (
              <Field label={field} key={field}>
                <TextInput
                  name={`${name}_${entryIndex}_${fieldIndex}`}
                  type={field.toLowerCase().includes("date") ? "date" : "text"}
                />
              </Field>
            ))}
          </div>
        </div>
      ))}
      <div className="flex justify-end">
        <button
          className="inline-flex min-h-11 w-full items-center justify-center rounded-lg border-2 border-dashed border-slate-300 px-4 py-2.5 text-sm font-semibold text-primary transition-colors hover:border-primary hover:bg-blue-50 sm:w-auto"
          onClick={onAdd}
          type="button"
        >
          {addLabel}
        </button>
      </div>
    </div>
  );
}
export function ApplicationFormClient() {
  const [activeStep, setActiveStep] = useState(0);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [language, setLanguage] = useState<FormLanguage>("en");
  const [entryCounts, setEntryCounts] = useState({
    competency: 1,
    licensure: 1,
    training: 1,
    workExperience: 1,
  });
  const t = translations[language];
  const isFirstStep = activeStep === 0;
  const isLastStep = activeStep === t.steps.length - 1;

  function goToPreviousStep() {
    setActiveStep((current) => Math.max(current - 1, 0));
  }

  function goToNextStep() {
    setActiveStep((current) => Math.min(current + 1, t.steps.length - 1));
  }

  function addEntry(section: keyof typeof entryCounts) {
    setEntryCounts((current) => ({
      ...current,
      [section]: current[section] + 1,
    }));
  }

  function removeEntry(section: keyof typeof entryCounts) {
    setEntryCounts((current) => ({
      ...current,
      [section]: Math.max(current[section] - 1, 1),
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsGeneratingPdf(true);

    try {
      await downloadFilledApplicationPdf(event.currentTarget);
    } finally {
      setIsGeneratingPdf(false);
    }
  }

  return (
    <>
      <section className="space-y-5">
        <div className="space-y-4">
          <nav aria-label="Breadcrumb" className="text-sm text-secondary">
            <ol className="flex flex-wrap items-center gap-2">
              <li>{t.breadcrumbForm}</li>
              <li>
                <FontAwesomeIcon aria-hidden="true" className="h-3 w-3" icon={faChevronRight} />
              </li>
              <li className="font-semibold text-primary">{t.breadcrumbCurrent}</li>
            </ol>
          </nav>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <h1 className="text-3xl font-bold leading-tight text-primary">{t.title}</h1>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-bold uppercase text-secondary">
                {t.stepCount} {activeStep + 1} {t.of} {t.steps.length}
              </p>
              <p className="max-w-3xl text-sm leading-6 text-secondary">{t.stepDescriptions[activeStep]}</p>
            </div>
            </div>
            <div className="flex w-fit shrink-0 items-center rounded-lg border border-outline-variant bg-white p-1">
              <span className="px-3 text-sm font-semibold text-secondary">{t.language}</span>
              <button
                className={
                  language === "en"
                    ? "min-h-10 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white"
                    : "min-h-10 rounded-md px-3 py-2 text-sm font-semibold text-secondary transition-colors hover:bg-surface-container"
                }
                onClick={() => setLanguage("en")}
                type="button"
              >
                English
              </button>
              <button
                className={
                  language === "tl"
                    ? "min-h-10 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white"
                    : "min-h-10 rounded-md px-3 py-2 text-sm font-semibold text-secondary transition-colors hover:bg-surface-container"
                }
                onClick={() => setLanguage("tl")}
                type="button"
              >
                Tagalog
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto pb-2">
          <div className="relative flex min-w-3xl items-start justify-between gap-5">
            <div className="absolute left-5 right-5 top-5 -z-0 h-px bg-slate-200" />
            {t.steps.map((step, index) => {
              const isActive = index === activeStep;
              const isComplete = index < activeStep;

              return (
                <div className="relative z-10 flex min-w-24 flex-col items-center gap-2" key={step}>
                  <button
                    aria-current={isActive ? "step" : undefined}
                    aria-label={`Go to ${step}`}
                    className={
                      isActive
                        ? "flex h-11 w-11 items-center justify-center rounded-full bg-primary font-bold text-white shadow-md"
                        : isComplete
                          ? "flex h-11 w-11 items-center justify-center rounded-full border-2 border-primary bg-white font-bold text-primary transition-colors hover:bg-blue-50"
                          : "flex h-11 w-11 items-center justify-center rounded-full border-2 border-slate-200 bg-white font-bold text-slate-400 transition-colors hover:border-primary/50 hover:text-primary"
                    }
                    onClick={() => setActiveStep(index)}
                    type="button"
                  >
                    {index + 1}
                  </button>
                  <button
                    className={
                      isActive || isComplete
                        ? "min-h-11 text-center text-sm font-semibold text-primary"
                        : "min-h-11 text-center text-sm font-semibold text-slate-400 transition-colors hover:text-primary"
                    }
                    onClick={() => setActiveStep(index)}
                    type="button"
                  >
                    {step}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:p-6">
        <form className="space-y-10" onSubmit={handleSubmit}>
          <div className={activeStep === 0 ? "space-y-10" : "hidden"}>
              <FormSection icon={faClipboardCheck} title={t.sections.assessmentDetails}>
                <div className="grid gap-5 pt-2 md:grid-cols-2">
                  <Field label={t.labels.school}>
                    <TextInput name="school" />
                  </Field>
                  <Field label={t.labels.address}>
                    <TextInput name="school_address" />
                  </Field>
                  <Field label={t.labels.assessmentTitle}>
                    <TextInput name="assessment_title" />
                  </Field>
                  <div className="space-y-2">
                    <span className="block text-sm font-semibold text-on-surface-variant">
                      {t.labels.assessmentType}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {t.options.assessmentTypes.map((assessmentType) => (
                        <RadioOption
                          className={
                            assessmentType === "Full Qualification"
                              ? "min-w-44 flex-[1.5_1_11rem]"
                              : assessmentType === "COC"
                                ? "min-w-20 flex-[0.6_1_5rem]"
                                : "min-w-28 flex-1"
                          }
                          key={assessmentType}
                          label={assessmentType}
                          name="assessment_type"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </FormSection>

              <FormSection icon={faIdCard} title={t.sections.clientType}>
                <OptionGroup>
                  {t.options.clientTypes.map((clientType) => (
                    <RadioOption key={clientType} label={clientType} name="client_type" />
                  ))}
                </OptionGroup>
              </FormSection>
          </div>

          <div className={activeStep === 1 ? "space-y-10" : "hidden"}>
            <FormSection icon={faUser} title={t.sections.profile}>
              <div className="grid gap-5 md:grid-cols-3">
                <Field label={t.labels.surname}>
                  <TextInput name="surname" />
                </Field>
                <Field label={t.labels.firstName}>
                  <TextInput name="first_name" />
                </Field>
                <Field label={t.labels.middleName}>
                  <TextInput name="middle_name" />
                </Field>
                <Field label={t.labels.middleInitial}>
                  <TextInput name="middle_initial" />
                </Field>
                <Field label={t.labels.nameExtension}>
                  <TextInput name="name_extension" placeholder={t.placeholders.nameExtension} />
                </Field>
              </div>

              <div className="mt-6 space-y-7">
                <FieldGroup className="border-t-0 pt-0">
                  <Field label={t.labels.mailingAddress}>
                  <div className="grid gap-4 md:grid-cols-3">
                    <TextInput name="street" placeholder={t.placeholders.street} />
                    <TextInput name="barangay" placeholder={t.placeholders.barangay} />
                    <TextInput name="district" placeholder={t.placeholders.district} />
                    <TextInput name="city" placeholder={t.placeholders.city} />
                    <TextInput name="province" placeholder={t.placeholders.province} />
                    <TextInput name="region" placeholder={t.placeholders.region} />
                    <TextInput name="zip_code" placeholder={t.placeholders.zipCode} />
                  </div>
                  </Field>
                </FieldGroup>

                <FieldGroup>
                  <div className="grid gap-5 md:grid-cols-2">
                    <Field label={t.labels.motherName}>
                      <TextInput name="mother_name" />
                    </Field>
                    <Field label={t.labels.fatherName}>
                      <TextInput name="father_name" />
                    </Field>
                  </div>
                </FieldGroup>

                <FieldGroup>
                  <div className="grid gap-5 lg:grid-cols-2">
                    <div className="space-y-2">
                      <span className="block text-sm font-semibold text-on-surface-variant">{t.labels.sex}</span>
                      <OptionGroup>
                        {t.options.sex.map((sex) => (
                          <RadioOption key={sex} label={sex} name="sex" />
                        ))}
                      </OptionGroup>
                    </div>
                    <div className="space-y-2">
                      <span className="block text-sm font-semibold text-on-surface-variant">
                        {t.labels.civilStatus}
                      </span>
                      <OptionGroup>
                        {t.options.civilStatus.map((status) => (
                          <RadioOption key={status} label={status} name="civil_status" />
                        ))}
                      </OptionGroup>
                    </div>
                  </div>
                </FieldGroup>

                <FieldGroup>
                  <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                    <Field label={t.labels.telephone}>
                      <TextInput name="telephone" type="tel" />
                    </Field>
                    <Field label={t.labels.mobile}>
                      <TextInput name="mobile" type="tel" />
                    </Field>
                    <Field label={t.labels.email}>
                      <TextInput name="email" type="email" />
                    </Field>
                    <Field label={t.labels.fax}>
                      <TextInput name="fax" />
                    </Field>
                  </div>
                </FieldGroup>

                <FieldGroup>
                  <div className="grid gap-5 lg:grid-cols-2">
                    <div className="space-y-2">
                      <span className="block text-sm font-semibold text-on-surface-variant">
                        {t.labels.education}
                      </span>
                      <OptionGroup>
                        {t.options.education.map((education) => (
                          <RadioOption key={education} label={education} name="education" />
                        ))}
                      </OptionGroup>
                    </div>
                    <div className="space-y-2">
                      <span className="block text-sm font-semibold text-on-surface-variant">
                        {t.labels.employment}
                      </span>
                      <OptionGroup>
                        {t.options.employment.map((status) => (
                          <RadioOption key={status} label={status} name="employment_status" />
                        ))}
                      </OptionGroup>
                    </div>
                  </div>
                </FieldGroup>

                <FieldGroup>
                  <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_8rem]">
                    <Field label={t.labels.birthDate}>
                      <TextInput name="birth_date" type="date" />
                    </Field>
                    <Field label={t.labels.birthPlace}>
                      <TextInput name="birth_place" />
                    </Field>
                    <Field label={t.labels.age}>
                      <TextInput name="age" type="number" />
                    </Field>
                  </div>
                </FieldGroup>
              </div>
            </FormSection>
          </div>

          <div className={activeStep === 2 ? "space-y-10" : "hidden"}>
            <FormSection icon={faBriefcase} title={t.sections.workExperience}>
              <p className="mb-4 text-sm leading-6 text-secondary">{t.tableNotes.workExperience}</p>
              <EntryGroups
                addLabel={t.addEntry}
                count={entryCounts.workExperience}
                fields={t.tableColumns.workExperience}
                onAdd={() => addEntry("workExperience")}
                onRemove={() => removeEntry("workExperience")}
                removeLabel={t.removeEntry}
                name="work_experience"
              />
            </FormSection>
          </div>

          <div className={activeStep === 3 ? "space-y-10" : "hidden"}>
            <FormSection icon={faGraduationCap} title={t.sections.training}>
              <p className="mb-4 text-sm leading-6 text-secondary">{t.tableNotes.training}</p>
              <EntryGroups
                addLabel={t.addEntry}
                count={entryCounts.training}
                fields={t.tableColumns.training}
                onAdd={() => addEntry("training")}
                onRemove={() => removeEntry("training")}
                removeLabel={t.removeEntry}
                name="training"
              />
            </FormSection>
          </div>

          <div className={activeStep === 4 ? "space-y-10" : "hidden"}>
              <FormSection icon={faCertificate} title={t.sections.licensure}>
                <EntryGroups
                  addLabel={t.addEntry}
                  count={entryCounts.licensure}
                  fields={t.tableColumns.licensure}
                  onAdd={() => addEntry("licensure")}
                  onRemove={() => removeEntry("licensure")}
                  removeLabel={t.removeEntry}
                  name="licensure"
                />
              </FormSection>

              <FormSection icon={faCertificate} title={t.sections.competency}>
                <EntryGroups
                  addLabel={t.addEntry}
                  count={entryCounts.competency}
                  fields={t.tableColumns.competency}
                  onAdd={() => addEntry("competency")}
                  onRemove={() => removeEntry("competency")}
                  removeLabel={t.removeEntry}
                  name="competency"
                />
              </FormSection>

          </div>

          <div className={activeStep === 5 ? "space-y-10" : "hidden"}>
            <FormSection icon={faIdCard} title={t.sections.admissionSlip}>
              <div className="grid gap-5 md:grid-cols-2">
                <Field label={t.labels.applicantName}>
                  <TextInput name="admission_applicant_name" />
                </Field>
                <Field label={t.labels.admissionTel}>
                  <TextInput name="admission_tel" type="tel" />
                </Field>
                <Field label={t.labels.admissionAssessment}>
                  <TextInput name="admission_assessment" />
                </Field>
                <Field label={t.labels.officialReceiptNumber}>
                  <TextInput name="official_receipt_number" />
                </Field>
              </div>
            </FormSection>
          </div>

          <div className="flex flex-col gap-4 border-t border-slate-200 pt-8 md:flex-row md:items-center md:justify-between">
            <button
              className="order-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border-2 border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 md:order-1 md:w-auto"
              type="button"
            >
              <FontAwesomeIcon aria-hidden="true" className="h-4 w-4" icon={faSave} />
              {t.saveDraft}
            </button>

            <div className="order-1 flex w-full flex-col gap-4 md:order-2 md:w-auto md:flex-row">
              <button
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border-2 border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 md:w-auto"
                disabled={isFirstStep}
                onClick={goToPreviousStep}
                type="button"
              >
                {t.back}
              </button>
              {isLastStep ? (
                <button
                  className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-primary-container md:w-auto"
                  disabled={isGeneratingPdf}
                  type="submit"
                >
                  <FontAwesomeIcon aria-hidden="true" className="h-4 w-4" icon={faPrint} />
                  {isGeneratingPdf ? "Generating..." : t.finish}
                </button>
              ) : (
                <button
                  className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-primary-container md:w-auto"
                  onClick={goToNextStep}
                  type="button"
                >
                  {t.next}
                </button>
              )}
            </div>
          </div>
        </form>
      </section>

      <section className="rounded-lg border border-blue-100 bg-blue-50 p-4 lg:hidden">
        <p className="text-center text-sm leading-6 text-blue-800">
          {t.mobileReminder}
        </p>
      </section>
    </>
  );
}
