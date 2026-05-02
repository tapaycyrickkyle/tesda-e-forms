import Image from "next/image";
import Link from "next/link";
import LoginForm from "./login-form";

export default function Home() {
  return (
    <main className="app-shell relative flex items-center justify-center overflow-hidden px-4 pb-4 pt-12 sm:px-6 sm:pb-6 sm:pt-16">
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
          <h1 className="mb-2 text-3xl font-bold leading-tight text-white">
            TESDA E-Forms
          </h1>
          <p className="mx-auto max-w-xs text-sm leading-6 text-white/90">
            Application Form System for TESDA Eastern Samar Provincial Office
          </p>
        </div>

        <div className="w-full rounded-lg border border-white/60 bg-white/95 p-5 shadow-xl sm:p-6">
          <LoginForm />

          <div className="mt-8 border-t border-outline-variant pt-6 text-center">
            <p className="text-sm leading-6 text-secondary">
              Don&apos;t have an account yet?
              <Link className="ml-1 inline-flex min-h-10 items-center font-bold text-primary hover:underline" href="/sign-up">
                Create Account
              </Link>
            </p>
          </div>
        </div>

        <footer className="mt-8 space-y-1 text-center opacity-70">
          <p className="text-sm leading-6 text-white">
            &copy; 2026 TESDA E-Forms Portal. All rights reserved.
          </p>
        </footer>
      </section>

    </main>
  );
}
