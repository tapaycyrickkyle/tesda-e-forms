"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AuthNotificationModal } from "./auth-notification-modal";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
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
  const [notification, setNotification] = useState<{
    message: string;
    title: string;
    type: "error" | "success";
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const firstName = String(formData.get("firstName") ?? "").trim();
    const middleName = String(formData.get("middleName") ?? "").trim();
    const surname = String(formData.get("surname") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    setNotification(null);

    if (password !== confirmPassword) {
      setNotification({
        message: "Passwords do not match.",
        title: "Sign Up Failed",
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            middle_name: middleName,
            surname,
            full_name: [firstName, middleName, surname].filter(Boolean).join(" "),
          },
          emailRedirectTo:
            typeof window === "undefined"
              ? undefined
              : `${window.location.origin}/auth/confirmed`,
        },
      });

      if (error) {
        setNotification({
          message: error.message,
          title: "Sign Up Failed",
          type: "error",
        });
        return;
      }

      if (data.session) {
        router.refresh();
        router.push("/applicant");
        return;
      }

      form.reset();
      setNotification({
        message: "Account created. Please check your email to confirm your account.",
        title: "Confirmation Email Sent",
        type: "success",
      });
    } catch (error) {
      setNotification({
        message:
          error instanceof Error
            ? error.message
            : "Unable to create account. Please try again.",
        title: "Sign Up Failed",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function clearMessages() {
    if (notification) {
      setNotification(null);
    }
  }

  return (
    <>
      {notification ? (
        <AuthNotificationModal
          message={notification.message}
          onClose={() => setNotification(null)}
          title={notification.title}
          type={notification.type}
        />
      ) : null}

      <form className="space-y-5" method="post" onSubmit={handleSubmit}>
      <div className="space-y-5">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-on-surface" htmlFor="firstName">
            First Name
          </label>
          <div className="group relative">
            <span className="absolute left-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center text-outline transition-colors group-focus-within:text-primary">
              <FontAwesomeIcon aria-hidden="true" icon={faIdCard} />
            </span>
            <input
              className="min-h-11 w-full rounded-lg border border-outline-variant bg-surface-bright py-2.5 pl-10 pr-4 text-base leading-6 text-on-surface outline-none transition-all placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary/25"
              id="firstName"
              name="firstName"
              onChange={clearMessages}
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
              className="min-h-11 w-full rounded-lg border border-outline-variant bg-surface-bright py-2.5 pl-10 pr-4 text-base leading-6 text-on-surface outline-none transition-all placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary/25"
              id="middleName"
              name="middleName"
              onChange={clearMessages}
              placeholder="Enter middle name"
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
            className="min-h-11 w-full rounded-lg border border-outline-variant bg-surface-bright py-2.5 pl-10 pr-4 text-base leading-6 text-on-surface outline-none transition-all placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary/25"
            id="surname"
            name="surname"
            onChange={clearMessages}
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
            className="min-h-11 w-full rounded-lg border border-outline-variant bg-surface-bright py-2.5 pl-10 pr-4 text-base leading-6 text-on-surface outline-none transition-all placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary/25"
            id="email"
            name="email"
            onChange={clearMessages}
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
            className="min-h-11 w-full rounded-lg border border-outline-variant bg-surface-bright py-2.5 pl-10 pr-12 text-base leading-6 text-on-surface outline-none transition-all placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary/25"
            id="password"
            name="password"
            onChange={clearMessages}
            placeholder="Create a password"
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

      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-on-surface" htmlFor="confirmPassword">
          Confirm Password
        </label>
        <div className="group relative">
          <span className="absolute left-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center text-outline transition-colors group-focus-within:text-primary">
            <FontAwesomeIcon aria-hidden="true" icon={faLock} />
          </span>
          <input
            className="min-h-11 w-full rounded-lg border border-outline-variant bg-surface-bright py-2.5 pl-10 pr-12 text-base leading-6 text-on-surface outline-none transition-all placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary/25"
            id="confirmPassword"
            name="confirmPassword"
            onChange={clearMessages}
            placeholder="Confirm your password"
            required
            type={showConfirmPassword ? "text" : "password"}
          />
          <button
            aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
            className="absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-outline transition-colors hover:bg-surface-container hover:text-on-surface"
            onClick={() => setShowConfirmPassword((current) => !current)}
            type="button"
          >
            <FontAwesomeIcon aria-hidden="true" icon={showConfirmPassword ? faEyeSlash : faEye} />
          </button>
        </div>
      </div>

      <button
        className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-base font-semibold text-on-primary shadow-sm transition-all hover:bg-primary-container hover:shadow-md active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "Creating account..." : "Create Account"}
      </button>
      </form>
    </>
  );
}
