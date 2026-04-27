import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faCircleQuestion,
  faMagnifyingGlass,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { ApplicantSidebar } from "./applicant-sidebar";

export default function ApplicantLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="app-shell">
      <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-end border-b border-slate-200 bg-white px-4 shadow-sm md:left-64 md:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="hidden items-center gap-2 rounded-lg border border-outline-variant bg-surface-container px-3 py-2 lg:flex">
            <FontAwesomeIcon aria-hidden="true" className="h-4 w-4 text-outline" icon={faMagnifyingGlass} />
            <input
              aria-label="Search forms"
              className="w-48 border-none bg-transparent text-sm text-on-surface outline-none placeholder:text-outline"
              placeholder="Search forms..."
              type="search"
            />
          </div>

          <button
            aria-label="Notifications"
            className="relative rounded-full p-2 text-secondary transition-colors hover:bg-surface-container"
            type="button"
          >
            <FontAwesomeIcon aria-hidden="true" className="h-5 w-5" icon={faBell} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-error" />
          </button>
          <button
            aria-label="Help"
            className="rounded-full p-2 text-secondary transition-colors hover:bg-surface-container"
            type="button"
          >
            <FontAwesomeIcon aria-hidden="true" className="h-5 w-5" icon={faCircleQuestion} />
          </button>
          <div className="hidden h-8 w-px bg-outline-variant sm:block" />
          <button
            className="flex items-center gap-2 rounded-full p-1 pl-2 transition-colors hover:bg-surface-container"
            type="button"
          >
            <span className="hidden text-sm font-semibold text-on-surface lg:block">
              Juan Dela Cruz
            </span>
            <FontAwesomeIcon aria-hidden="true" className="h-8 w-8 text-primary" icon={faUserCircle} />
          </button>
        </div>
      </header>

      <ApplicantSidebar />

      <main className="min-h-screen pt-16 md:pl-64">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 p-4 sm:p-6 lg:p-12">
          {children}
        </div>
      </main>
    </div>
  );
}
