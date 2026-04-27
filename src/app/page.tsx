import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuildingColumns } from "@fortawesome/free-solid-svg-icons";
import LoginForm from "./login-form";

export default function Home() {
  return (
    <main className="app-shell relative flex items-center justify-center overflow-hidden px-4 pb-4 pt-12 sm:px-6 sm:pb-6 sm:pt-16">
      <section className="z-10 flex w-full max-w-md flex-col items-center">
        <div className="mb-6 text-center">
          <h1 className="mb-1 text-3xl font-bold leading-tight text-primary">
            TESDA E-Forms
          </h1>
          <p className="mx-auto max-w-xs text-sm leading-6 text-secondary">
            Application Form System for TESDA Eastern Samar Provincial Office
          </p>
        </div>

        <div className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest p-8 shadow-xl">
          <LoginForm />

          <div className="mt-8 border-t border-outline-variant pt-6 text-center">
            <p className="text-sm text-secondary">
              Don&apos;t have an account yet?
              <a className="ml-1 font-bold text-primary hover:underline" href="#">
                Create Account
              </a>
            </p>
          </div>
        </div>

        <footer className="mt-8 space-y-1 text-center opacity-70">
          <p className="text-sm text-on-surface-variant">
            &copy; 2024 TESDA E-Forms Portal. All rights reserved.
          </p>
          <nav
            aria-label="Institutional links"
            className="flex justify-center gap-4 text-xs font-medium text-secondary"
          >
            <a className="transition-colors hover:text-primary" href="#">
              Privacy Policy
            </a>
            <span aria-hidden="true" className="mt-1.5 h-1 w-1 rounded-full bg-outline-variant" />
            <a className="transition-colors hover:text-primary" href="#">
              Terms of Service
            </a>
            <span aria-hidden="true" className="mt-1.5 h-1 w-1 rounded-full bg-outline-variant" />
            <a className="transition-colors hover:text-primary" href="#">
              Support
            </a>
          </nav>
        </footer>
      </section>

      <div className="pointer-events-none fixed bottom-0 right-0 hidden p-12 text-on-surface opacity-5 sm:block">
        <FontAwesomeIcon aria-hidden="true" className="h-56 w-56" icon={faBuildingColumns} />
      </div>
    </main>
  );
}
