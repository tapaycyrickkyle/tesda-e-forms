import type { Metadata } from "next";
import { MyApplicationClientPage } from "./page-client";

export const metadata: Metadata = {
  title: "My Application | TESDA E-Forms Portal",
  description: "TESDA E-Forms applicant application status.",
};

export default function MyApplicationPage() {
  return <MyApplicationClientPage />;
}
