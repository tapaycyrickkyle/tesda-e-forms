"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faEye,
  faEyeSlash,
  faIdCard,
  faLock,
} from "@fortawesome/free-solid-svg-icons";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push("/");
  }

  return (
    <form className="space-y-5" method="post" onSubmit={handleSubmit}>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-on-surface" htmlFor="firstName">
            First Name
          </label>
          <div className="group relative">
            <span className="absolute left-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center text-outline transition-colors group-focus-within:text-primary">
              <FontAwesomeIcon aria-hidden="true" icon={faIdCard} />
            </span>
            <input
              className="w-full rounded-lg border border-outline-variant bg-surface-bright py-3 pl-10 pr-4 text-base text-on-surface outline-none transition-all placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary/25"
              id="firstName"
              name="firstName"
              placeholder="Enter first name"
              required
              type="text"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-on-surface" htmlFor="middleName">
            Middle Name
          </label>
          <div className="group relative">
            <span className="absolute left-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center text-outline transition-colors group-focus-within:text-primary">
              <FontAwesomeIcon aria-hidden="true" icon={faIdCard} />
            </span>
            <input
              className="w-full rounded-lg border border-outline-variant bg-surface-bright py-3 pl-10 pr-4 text-base text-on-surface outline-none transition-all placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary/25"
              id="middleName"
              name="middleName"
              placeholder="Optional"
              type="text"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-on-surface" htmlFor="surname">
          Surname
        </label>
        <div className="group relative">
          <span className="absolute left-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center text-outline transition-colors group-focus-within:text-primary">
            <FontAwesomeIcon aria-hidden="true" icon={faIdCard} />
          </span>
          <input
            className="w-full rounded-lg border border-outline-variant bg-surface-bright py-3 pl-10 pr-4 text-base text-on-surface outline-none transition-all placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary/25"
            id="surname"
            name="surname"
            placeholder="Enter surname"
            required
            type="text"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-on-surface" htmlFor="email">
          Email Address
        </label>
        <div className="group relative">
          <span className="absolute left-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center text-outline transition-colors group-focus-within:text-primary">
            <FontAwesomeIcon aria-hidden="true" icon={faEnvelope} />
          </span>
          <input
            className="w-full rounded-lg border border-outline-variant bg-surface-bright py-3 pl-10 pr-4 text-base text-on-surface outline-none transition-all placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary/25"
            id="email"
            name="email"
            placeholder="name@example.com"
            required
            type="email"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-on-surface" htmlFor="password">
          Password
        </label>
        <div className="group relative">
          <span className="absolute left-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center text-outline transition-colors group-focus-within:text-primary">
            <FontAwesomeIcon aria-hidden="true" icon={faLock} />
          </span>
          <input
            className="w-full rounded-lg border border-outline-variant bg-surface-bright py-3 pl-10 pr-11 text-base text-on-surface outline-none transition-all placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary/25"
            id="password"
            name="password"
            placeholder="Create a password"
            required
            type={showPassword ? "text" : "password"}
          />
          <button
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center text-outline transition-colors hover:text-on-surface"
            onClick={() => setShowPassword((current) => !current)}
            type="button"
          >
            <FontAwesomeIcon aria-hidden="true" icon={showPassword ? faEyeSlash : faEye} />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-on-surface" htmlFor="confirmPassword">
          Confirm Password
        </label>
        <div className="group relative">
          <span className="absolute left-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center text-outline transition-colors group-focus-within:text-primary">
            <FontAwesomeIcon aria-hidden="true" icon={faLock} />
          </span>
          <input
            className="w-full rounded-lg border border-outline-variant bg-surface-bright py-3 pl-10 pr-11 text-base text-on-surface outline-none transition-all placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary/25"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm your password"
            required
            type={showConfirmPassword ? "text" : "password"}
          />
          <button
            aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
            className="absolute right-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center text-outline transition-colors hover:text-on-surface"
            onClick={() => setShowConfirmPassword((current) => !current)}
            type="button"
          >
            <FontAwesomeIcon aria-hidden="true" icon={showConfirmPassword ? faEyeSlash : faEye} />
          </button>
        </div>
      </div>

      <button
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-4 text-base font-semibold text-on-primary shadow-sm transition-all hover:bg-primary-container hover:shadow-md active:scale-95"
        type="submit"
      >
        Create Account
      </button>
    </form>
  );
}
