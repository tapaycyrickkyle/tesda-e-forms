"use client";

type AuthLoadingModalProps = Readonly<{
  message: string;
  title: string;
}>;

export function AuthLoadingModal({ message, title }: AuthLoadingModalProps) {
  return (
    <div
      aria-labelledby="auth-loading-title"
      aria-live="polite"
      aria-modal="true"
      className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4 py-6"
      role="dialog"
    >
      <div className="w-full max-w-sm rounded-lg border border-outline-variant bg-surface-container-lowest p-5 text-center shadow-2xl">
        <div
          aria-hidden="true"
          className="mx-auto mb-4 h-11 w-11 animate-spin rounded-full border-4 border-surface-container-highest border-t-primary"
        />
        <h2 className="mb-2 text-xl font-semibold text-on-surface" id="auth-loading-title">
          {title}
        </h2>
        <p className="text-sm leading-6 text-secondary">{message}</p>
      </div>
    </div>
  );
}
