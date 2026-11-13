import { useEffect, useRef, useState, type SyntheticEvent } from "react";
import type { Control, Question } from "./questions";

interface AnswerControlProps {
  question: Question;
  control: Control;
  onSubmit: (draft: string) => void;
}

const FIELD =
  "min-w-0 flex-1 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400";

/** The control under the assistant's question: a text box, date picker or number box, or bubbles to choose from. */
export default function AnswerControl({ question, control, onSubmit }: AnswerControlProps) {
  const [draft, setDraft] = useState("");
  const first = useRef<HTMLElement | null>(null);

  // Put the cursor in the control as soon as the question appears.
  useEffect(() => {
    first.current?.focus();
  }, []);

  // Choice questions: the options are bubbles, and clicking one answers the question straight away.
  if (control.kind === "select") {
    return (
      <div role="group" aria-label={question.label} className="mx-auto flex max-h-48 w-full max-w-3xl flex-wrap gap-2 overflow-y-auto p-1">
        {control.options.map((option, index) => (
          <button
            key={option.value}
            type="button"
            ref={
              index === 0
                ? (element) => {
                    first.current = element;
                  }
                : undefined
            }
            onClick={() => onSubmit(option.value)}
            className="rounded-full border border-indigo-200 bg-white px-4 py-2 text-sm font-medium text-indigo-700 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-400 hover:bg-indigo-50 hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
          >
            {option.label}
          </button>
        ))}
      </div>
    );
  }

  function handleSubmit(event: SyntheticEvent) {
    event.preventDefault();
    onSubmit(draft);
  }

  return (
    // noValidate: the assistant explains problems in its own words instead of the browser's pop-up.
    <form onSubmit={handleSubmit} noValidate className="mx-auto flex w-full max-w-3xl items-end gap-3">
      <input
        ref={(element) => {
          first.current = element;
        }}
        aria-label={question.label}
        type={control.kind === "text" ? control.inputType : control.kind}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder={control.kind === "text" || control.kind === "number" ? control.placeholder : undefined}
        min={control.kind === "date" || control.kind === "number" ? control.min : undefined}
        max={control.kind === "date" || control.kind === "number" ? control.max : undefined}
        inputMode={control.kind === "number" || (control.kind === "text" && control.numeric) ? "numeric" : undefined}
        autoComplete="off"
        className={FIELD}
      />
      <button
        type="submit"
        className="assistant-bubble-user shrink-0 rounded-xl px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2"
      >
        Next
      </button>
    </form>
  );
}
