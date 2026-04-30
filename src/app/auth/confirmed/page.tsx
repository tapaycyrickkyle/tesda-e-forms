import type { Metadata } from "next";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuildingColumns, faCheck } from "@fortawesome/free-solid-svg-icons";

export const metadata: Metadata = {
  title: "Email Confirmed | TESDA E-Forms Portal",
  description: "Your TESDA E-Forms Portal account email has been confirmed.",
};

export default function AuthConfirmedPage() {
  return (
    <main className="app-shell relative flex items-center justify-center overflow-hidden px-4 pb-4 pt-12 sm:px-6 sm:pb-6 sm:pt-16">
      <section className="z-10 flex w-full max-w-md flex-col items-center">
        <div className="mb-6 text-center">
          <h1 className="mb-1 text-3xl font-bold leading-tight text-primary">
            Email Confirmed
          </h1>
          <p className="mx-auto max-w-xs text-sm leading-6 text-secondary">
            Your account is ready. You can now log in to continue your TESDA E-Forms application.
          </p>
        </div>

        <div className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest p-8 text-center shadow-xl">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-700">
            <FontAwesomeIcon aria-hidden="true" className="h-14 w-14" icon={faCheck} />
          </div>
          <p className="mb-6 text-sm leading-6 text-secondary">
            Thank you for confirming your email address.
          </p>
          <Link
            className="flex w-full items-center justify-center rounded-lg bg-primary px-4 py-4 text-base font-semibold text-on-primary shadow-sm transition-all hover:bg-primary-container hover:shadow-md active:scale-95"
            href="/"
          >
            Go to Login
          </Link>
        </div>
      </section>

      <div className="pointer-events-none fixed bottom-0 right-0 hidden p-12 text-on-surface opacity-5 sm:block">
        <FontAwesomeIcon aria-hidden="true" className="h-56 w-56" icon={faBuildingColumns} />
      </div>
    </main>
  );
}
