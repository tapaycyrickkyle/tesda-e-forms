"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faCircleExclamation,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

type AuthNotificationModalProps = Readonly<{
  message: string;
  onClose: () => void;
  title: string;
  type: "error" | "success";
}>;

export function AuthNotificationModal({
  message,
  onClose,
  title,
  type,
}: AuthNotificationModalProps) {
  const isError = type === "error";

  return (
    <div
      aria-labelledby="auth-notification-title"
      aria-modal="true"
      className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4 py-6"
      role="dialog"
    >
      <div className="relative w-full max-w-sm rounded-lg border border-outline-variant bg-surface-container-lowest p-5 text-center shadow-2xl">
        <div className="mb-4 flex justify-center">
          <div
            className={
              isError
                ? "flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-50 text-error"
                : "flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-700"
            }
          >
            <FontAwesomeIcon
              aria-hidden="true"
              className="h-6 w-6"
              icon={isError ? faCircleExclamation : faCircleCheck}
            />
          </div>
        </div>
        <button
          aria-label="Close notification"
          className="absolute right-2 top-2 flex h-11 w-11 items-center justify-center rounded-full text-outline transition-colors hover:bg-surface-container hover:text-on-surface"
          onClick={onClose}
          type="button"
        >
          <FontAwesomeIcon aria-hidden="true" className="h-4 w-4" icon={faXmark} />
        </button>

        <h2 className="mb-2 text-xl font-semibold text-on-surface" id="auth-notification-title">
          {title}
        </h2>
        <p className="text-sm leading-6 text-secondary">{message}</p>

        <button
          className="mt-6 flex min-h-11 w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary shadow-sm transition-all hover:bg-primary-container hover:shadow-md active:scale-95"
          onClick={onClose}
          type="button"
        >
          OK
        </button>
      </div>
    </div>
  );
}
