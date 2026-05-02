"use client";

import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { useState } from "react";
import {
  faClipboardCheck,
  faFileLines,
  faHouse,
  faRightFromBracket,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const navItems = [
  { label: "Dashboard", icon: faHouse, href: "/applicant" },
  { label: "Application Form", icon: faFileLines, href: "/applicant/application-form" },
  { label: "My Application", icon: faClipboardCheck, href: "/applicant/my-application" },
];

const accountItems = [
  { label: "Profile", icon: faUser, href: "/applicant/profile" },
];

function isActivePath(pathname: string, href: string) {
  if (href === "#") {
    return false;
  }

  if (href === "/applicant") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function SidebarLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: IconDefinition;
  label: string;
}) {
  const pathname = usePathname();
  const isActive = isActivePath(pathname, href);

  return (
    <Link
      aria-current={isActive ? "page" : undefined}
      className={
        isActive
          ? "flex min-h-10 items-center gap-3 rounded-lg bg-blue-800/80 px-4 py-2.5 font-semibold text-white shadow-inner transition-colors"
          : "flex min-h-10 items-center gap-3 rounded-lg px-4 py-2.5 text-blue-100/80 transition-colors hover:bg-blue-800/60 hover:text-white"
      }
      href={href}
    >
      <FontAwesomeIcon aria-hidden="true" className="h-5 w-5" icon={icon} />
      <span className="text-sm">{label}</span>
    </Link>
  );
}

export function ApplicantSidebar() {
  const [isSigningOut, setIsSigningOut] = useState(false);
  const router = useRouter();

  async function handleSignOut() {
    setIsSigningOut(true);

    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();

    router.refresh();
    router.replace("/");
  }

  return (
    <aside className="fixed left-0 top-0 z-50 hidden h-full w-64 flex-col border-r border-blue-800 bg-blue-900 shadow-xl md:flex">
      <div className="p-5">
        <div className="text-xl font-semibold tracking-tight text-white">
          <span>TESDA E-Forms</span>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-4">
        <p className="mb-4 px-4 text-xs font-bold uppercase tracking-widest text-blue-100/60">
          Main Menu
        </p>
        {navItems.map((item) => (
          <SidebarLink key={item.label} {...item} />
        ))}

        <p className="mb-4 mt-8 px-4 text-xs font-bold uppercase tracking-widest text-blue-100/60">
          Account
        </p>
        {accountItems.map((item) => (
          <SidebarLink key={item.label} {...item} />
        ))}
        <button
          className="flex min-h-10 items-center gap-3 rounded-lg px-4 py-2.5 text-left text-blue-100/80 transition-colors hover:bg-blue-800/60 hover:text-white disabled:cursor-not-allowed disabled:opacity-70"
          disabled={isSigningOut}
          onClick={handleSignOut}
          type="button"
        >
          <FontAwesomeIcon aria-hidden="true" className="h-5 w-5" icon={faRightFromBracket} />
          <span className="text-sm">{isSigningOut ? "Logging out..." : "Logout"}</span>
        </button>
      </nav>
    </aside>
  );
}
