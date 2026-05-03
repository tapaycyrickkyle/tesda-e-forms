"use client";

import { useEffect, useState } from "react";

const MY_APPLICATION_BATCHES_KEY = "tesda_my_application_batches";

type StoredPdfs = {
  applicationForm: string;
  applicantName: string;
  assessmentTitle: string;
  consentForm: string;
  id: string;
  sagForm: string;
  submittedAt: string;
};

export function MyApplicationClientPage() {
  const [batches, setBatches] = useState<StoredPdfs[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(MY_APPLICATION_BATCHES_KEY);
    if (!raw) {
      return;
    }
    try {
      setBatches(JSON.parse(raw) as StoredPdfs[]);
    } catch {
      setBatches([]);
    }
  }, []);

  function downloadFile(dataUrl: string, filename: string) {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = filename;
    link.click();
  }

  function downloadBatch(batch: StoredPdfs, batchIndex: number) {
    const sequence = batchIndex + 1;
    const datePart = new Date(batch.submittedAt).toISOString().slice(0, 10);
    downloadFile(batch.applicationForm, `batch-${sequence}-${datePart}-application-form.pdf`);
    downloadFile(batch.sagForm, `batch-${sequence}-${datePart}-self-assessment-guide.pdf`);
    downloadFile(batch.consentForm, `batch-${sequence}-${datePart}-consent-form.pdf`);
  }

  function deleteBatch(batchId: string) {
    const updated = batches.filter((batch) => batch.id !== batchId);
    setBatches(updated);
    localStorage.setItem(MY_APPLICATION_BATCHES_KEY, JSON.stringify(updated));
  }

  function toTitleCase(value: string) {
    return value
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  function formatApplicantName(name: string) {
    const trimmed = name.trim();
    if (!trimmed || trimmed === "N/A") {
      return "";
    }

    const parts = trimmed.split(",").map((part) => part.trim()).filter(Boolean);
    if (parts.length >= 2) {
      const last = toTitleCase(parts[0]);
      const firstAndMiddleRaw = parts.slice(1).join(" ");
      const tokens = firstAndMiddleRaw.split(/\s+/).filter(Boolean);
      const first = tokens[0] ? toTitleCase(tokens[0]) : "";
      const middleInitial = tokens[1] ? `${tokens[1].charAt(0).toUpperCase()}.` : "";
      return [last, [first, middleInitial].filter(Boolean).join(" ")].filter(Boolean).join(", ");
    }

    return toTitleCase(trimmed);
  }

  return (
    <section className="space-y-5">
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:p-6">
        <div className="max-w-3xl space-y-3">
          <h1 className="text-3xl font-bold leading-tight text-primary">My Application</h1>
          <p className="text-sm leading-6 text-secondary">
            Submission history by batch. Each batch includes Application Form, Self-Assessment Guide, and Consent Form.
          </p>
        </div>
      </div>

      {batches.length > 0 ? (
        <div className="space-y-5">
          {batches.map((batch, index) => (
            <section
              className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:p-6"
              key={batch.id}
            >
              <button
                aria-label="Delete application"
                className="absolute right-4 top-3 text-2xl font-semibold leading-none text-slate-500 transition-colors hover:text-primary"
                onClick={() => deleteBatch(batch.id)}
                type="button"
              >
                ×
              </button>
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-primary">{batch.assessmentTitle}</h2>
                  {formatApplicantName(batch.applicantName) ? (
                    <p className="text-sm text-secondary">{formatApplicantName(batch.applicantName)}</p>
                  ) : null}
                  <p className="text-xs text-slate-500">
                    Submitted: {new Date(batch.submittedAt).toLocaleString("en-PH")}
                  </p>
                  <div className="mt-4 grid gap-2 md:grid-cols-3">
                    <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">PDF 1</p>
                      <p className="text-sm font-medium text-primary">Application Form</p>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">PDF 2</p>
                      <p className="text-sm font-medium text-primary">Self-Assessment Guide</p>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">PDF 3</p>
                      <p className="text-sm font-medium text-primary">Consent Form</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 md:self-end">
                  <button
                    className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-primary-container"
                    onClick={() => downloadBatch(batch, index)}
                    type="button"
                  >
                    Download 3 PDFs
                  </button>
                </div>
              </div>
            </section>
          ))}
        </div>
      ) : (
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:p-6">
          <p className="text-sm leading-6 text-secondary">
            No compiled PDFs found yet. Complete the Application Form and click Finish to generate them.
          </p>
        </section>
      )}
    </section>
  );
}
