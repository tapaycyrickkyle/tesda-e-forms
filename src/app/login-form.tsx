"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AuthLoadingModal } from "./auth-loading-modal";
import { AuthNotificationModal } from "./auth-notification-modal";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  faEnvelope,
  faEye,
  faEyeSlash,
  faLock,
} from "@fortawesome/free-solid-svg-icons";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [notification, setNotification] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    setNotification("");
    setIsSubmitting(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setNotification(error.message);
        return;
      }

      router.refresh();
      router.push("/applicant");
    } catch (error) {
      setNotification(
        error instanceof Error
          ? error.message
          : "Unable to login. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function clearError() {
    if (notification) {
      setNotification("");
    }
  }

  return (
    <>
      {notification ? (
        <AuthNotificationModal
          message={notification}
          onClose={() => setNotification("")}
          title="Login Failed"
          type="error"
        />
      ) : null}
      {isSubmitting ? (
        <AuthLoadingModal
          message="Please wait while we verify your account."
          title="Logging in"
        />
      ) : null}

      <form className="space-y-6" method="post" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-on-surface" htmlFor="email">
          Email Address
        </label>
        <div className="group relative">
          <span className="absolute left-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center text-outline transition-colors group-focus-within:text-primary">
            <FontAwesomeIcon aria-hidden="true" icon={faEnvelope} />
          </span>
          <input
            autoComplete="email"
            className="min-h-11 w-full rounded-lg border border-outline-variant bg-surface-bright py-2.5 pl-10 pr-4 text-base leading-6 text-on-surface outline-none transition-all placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary/25"
            id="email"
            name="email"
            onChange={clearError}
            placeholder="Enter your email"
            required
            type="email"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-4">
          <label className="text-sm font-semibold text-on-surface" htmlFor="password">
            Password
          </label>
          <a className="inline-flex min-h-10 items-center text-sm font-semibold text-primary hover:underline" href="#">
            Forgot password?
          </a>
        </div>
        <div className="group relative">
          <span className="absolute left-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center text-outline transition-colors group-focus-within:text-primary">
            <FontAwesomeIcon aria-hidden="true" icon={faLock} />
          </span>
          <input
            autoComplete="current-password"
            className="min-h-11 w-full rounded-lg border border-outline-variant bg-surface-bright py-2.5 pl-10 pr-12 text-base leading-6 text-on-surface outline-none transition-all placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary/25"
            id="password"
            name="password"
            onChange={clearError}
            placeholder="Enter your password"
            required
            type={showPassword ? "text" : "password"}
          />
          <button
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-outline transition-colors hover:bg-surface-container hover:text-on-surface"
            onClick={() => setShowPassword((current) => !current)}
            type="button"
          >
            <FontAwesomeIcon aria-hidden="true" icon={showPassword ? faEyeSlash : faEye} />
          </button>
        </div>
      </div>

      <button
        className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-base font-semibold text-on-primary shadow-sm transition-all hover:bg-primary-container hover:shadow-md active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "Logging in..." : "Login"}
      </button>
      </form>
    </>
  );
}
