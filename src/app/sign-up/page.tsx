import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SignUpForm from "../sign-up-form";

export const metadata: Metadata = {
  title: "Sign Up | TESDA E-Forms Portal",
  description: "Create a TESDA E-Forms Portal applicant account.",
};

export default function SignUpPage() {
  return (
    <main className="app-shell relative flex items-center justify-center overflow-hidden px-4 pb-4 pt-8 sm:px-6 sm:pb-6 sm:pt-10">
      <Image
        alt=""
        aria-hidden="true"
        className="object-cover"
        fill
        priority
        src="/images/tesda-background.png"
      />
      <div className="absolute inset-0 bg-black/20" />
      <section className="z-10 flex w-full max-w-md flex-col items-center">
        <div className="mb-6 text-center">
          <h1 className="mb-1 text-3xl font-bold leading-tight text-white">
            Create Account
          </h1>
          <p className="mx-auto max-w-xs text-sm leading-6 text-white/90">
            Sign up for the TESDA E-Forms Portal to start your application.
          </p>
        </div>

        <div className="w-full rounded-xl border border-white/60 bg-white/95 p-8 shadow-xl">
          <SignUpForm />

          <div className="mt-8 border-t border-outline-variant pt-6 text-center">
            <p className="text-sm text-secondary">
              Already have an account?
              <Link
                className="ml-1 font-bold text-primary hover:underline"
                href="/"
              >
                Login
              </Link>
            </p>
          </div>
        </div>

        <footer className="mt-8 space-y-1 text-center opacity-70">
          <p className="text-sm text-white">
            &copy; 2026 TESDA E-Forms Portal. All rights reserved.
          </p>
        </footer>
      </section>
    </main>
  );
}
