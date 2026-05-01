import type { Metadata } from "next";
import { ApplicationFormClient } from "./application-form-client";

export const metadata: Metadata = {
  title: "Application Form | TESDA E-Forms Portal",
  description: "TESDA E-Forms applicant application form.",
};

export default function ApplicationFormPage() {
  return <ApplicationFormClient />;
}
