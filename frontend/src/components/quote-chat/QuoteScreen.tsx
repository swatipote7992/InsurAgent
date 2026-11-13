import { useEffect, useRef } from "react";

interface QuoteScreenProps {
  /** Close the full-screen page and go back to the assistant panel. */
  onClose: () => void;
}

/** What the "Your quote so far" box will list. Answers appear here once the questions exist (step 3). */
const SUMMARY_GROUPS: { title: string; labels: string[] }[] = [
  {
    title: "Your details",
    labels: [
      "Full name",
      "Date of birth",
      "Email",
      "Postcode area",
      "Licence type",
      "Years licence held",
      "Claims (5 years)",
      "Convictions (5 years)",
    ],
  },
  {
    title: "Your car",
    labels: ["Make", "Model", "Year", "Category", "Estimated value", "Annual mileage", "Overnight parking", "Main use"],
  },
  { title: "Your cover", labels: ["Start date", "Cover level", "Voluntary excess", "Optional extras"] },
];

function Sparkle({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 2l1.9 5.6L19.5 9l-5.6 1.9L12 16.5l-1.9-5.6L4.5 9l5.6-1.4L12 2z" />
      <path d="M19 14l.9 2.6 2.6.9-2.6.9L19 21l-.9-2.6-2.6-.9 2.6-.9L19 14z" opacity="0.8" />
    </svg>
  );
}

/** The full-screen "New quote" page: the assistant's chat on the left, the quote so far on the right. */
export default function QuoteScreen({ onClose }: QuoteScreenProps) {
  const backRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    backRef.current?.focus();
  }, []);

  // Escape goes back to the assistant.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="New quote"
      className="assistant-fullscreen assistant-messages fixed inset-0 z-[60] flex flex-col"
    >
      <header className="assistant-header flex items-center gap-3 px-4 py-3 text-white sm:px-6 sm:py-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 ring-1 ring-white/40">
          <Sparkle className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold leading-tight">New quote</h2>
          <p className="flex items-center gap-1.5 text-xs text-white/80">
            <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" />
            Assistant · Demo mode
          </p>
        </div>
        <button
          ref={backRef}
          type="button"
          onClick={onClose}
          className="rounded-full border border-white/40 px-4 py-1.5 text-sm font-medium hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          Back to assistant
        </button>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close new quote"
          className="rounded-full px-3 py-1 text-2xl leading-none text-white/90 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          ×
        </button>
      </header>

      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        <section aria-label="Quote conversation" className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="mx-auto w-full max-w-3xl space-y-3">
              <div className="assistant-message flex items-end gap-2">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                  <Sparkle className="h-4 w-4" />
                </span>
                <p className="max-w-[85%] rounded-2xl rounded-bl-sm bg-white px-4 py-2 text-sm text-gray-800 shadow-sm ring-1 ring-gray-100">
                  <span className="sr-only">Assistant: </span>
                  Hi! Let's create your quote together.
                </p>
              </div>
              <div className="assistant-message flex items-end gap-2">
                <span className="h-8 w-8 shrink-0" aria-hidden="true" />
                <p className="max-w-[85%] rounded-2xl rounded-bl-sm bg-white px-4 py-2 text-sm text-gray-800 shadow-sm ring-1 ring-gray-100">
                  <span className="sr-only">Assistant: </span>
                  I'll ask you one question at a time, and your answers will build up in the box on the right.
                </p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-100 bg-white p-4">
            <p className="mx-auto max-w-3xl text-center text-sm text-gray-500">The questions will appear here.</p>
          </div>
        </section>

        <aside
          aria-label="Your quote so far"
          className="max-h-56 w-full shrink-0 overflow-y-auto border-t border-gray-200 bg-white p-5 md:max-h-none md:w-80 md:border-l md:border-t-0"
        >
          <h3 className="text-base font-semibold text-gray-900">Your quote so far</h3>
          <p className="mt-1 text-xs text-gray-500">Your answers will appear here as you give them.</p>
          {SUMMARY_GROUPS.map((group) => (
            <div key={group.title} className="mt-4">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-indigo-600">{group.title}</h4>
              <dl className="mt-2 space-y-1.5">
                {group.labels.map((label) => (
                  <div key={label} className="flex justify-between gap-3 text-sm">
                    <dt className="text-gray-600">{label}</dt>
                    <dd className="text-gray-400">—</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
}
