import { useEffect, useRef, useState } from "react";
import AnswerControl from "./AnswerControl";
import ChatBubble, { Sparkle, TypingBubble } from "./ChatBubble";
import { QUESTIONS, QUESTION_GROUPS, type Answers } from "./questions";
import { TYPING_DELAY_MS } from "./typing";

interface QuoteScreenProps {
  /** Close the full-screen page and go back to the assistant panel. */
  onClose: () => void;
}

/** The full-screen "New quote" page: the assistant asks questions on the left, the quote so far fills in on the right. */
export default function QuoteScreen({ onClose }: QuoteScreenProps) {
  const [answers, setAnswers] = useState<Answers>({});
  const [step, setStep] = useState(0);
  const [problem, setProblem] = useState<string | null>(null);
  // The assistant "types" before each new question, so it feels like it is starting the conversation itself.
  const [typing, setTyping] = useState(true);
  const endRef = useRef<HTMLDivElement>(null);

  const total = QUESTIONS.length;
  const finished = step >= total;
  const question = finished ? null : QUESTIONS[step];

  // Escape goes back to the assistant.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  // After the typing dots, the next message appears.
  useEffect(() => {
    if (!typing) return;
    const timer = setTimeout(() => setTyping(false), TYPING_DELAY_MS);
    return () => clearTimeout(timer);
  }, [typing]);

  // Keep the newest message in view.
  useEffect(() => {
    endRef.current?.scrollIntoView?.({ block: "end" });
  }, [step, problem, typing]);

  function submit(draft: string) {
    if (question === null) return;
    const message = question.validate(draft, answers);
    if (message !== null) {
      setProblem(message);
      return;
    }
    setAnswers((current) => ({ ...current, [question.id]: draft }));
    setStep(step + 1);
    setProblem(null);
    setTyping(true);
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="New quote"
      className="assistant-fullscreen assistant-messages fixed inset-0 z-[60] flex flex-col"
    >
      <header className="assistant-header text-white">
        <div className="flex items-center gap-3 px-4 py-3 sm:px-6 sm:py-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 ring-1 ring-white/40">
            <Sparkle className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold leading-tight">New quote</h2>
            <p className="flex items-center gap-1.5 text-xs text-white/80">
              <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" />
              {finished ? `All ${total} questions answered` : `Question ${step + 1} of ${total}`} · Demo mode
            </p>
          </div>
          <button
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
        </div>
        <div
          role="progressbar"
          aria-label="Quote progress"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={step}
          className="h-1 bg-white/20"
        >
          <div className="h-full bg-emerald-400 transition-all duration-300" style={{ width: `${(step / total) * 100}%` }} />
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        <section aria-label="Quote conversation" className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="mx-auto w-full max-w-3xl space-y-3">
              <ChatBubble from="assistant">
                Hi! I'm your quote assistant. Let's create your quote together. I'll ask one question at a time.
              </ChatBubble>
              {QUESTIONS.slice(0, step).map((answered) => (
                <div key={answered.id} className="space-y-3">
                  <ChatBubble from="assistant">{answered.prompt(answers)}</ChatBubble>
                  <ChatBubble from="user">{answered.display(answers)}</ChatBubble>
                </div>
              ))}
              {typing && <TypingBubble />}
              {!typing && question && <ChatBubble from="assistant">{question.prompt(answers)}</ChatBubble>}
              {!typing && problem && (
                <ChatBubble from="assistant" tone="problem">
                  {problem}
                </ChatBubble>
              )}
              {!typing && finished && (
                <ChatBubble from="assistant">
                  Thanks! That's every question answered. Reviewing and saving your quote comes next.
                </ChatBubble>
              )}
              <div ref={endRef} />
            </div>
          </div>
          {!typing && question && (
            <div className="border-t border-gray-100 bg-white p-4">
              <AnswerControl key={question.id} question={question} control={question.control(answers)} onSubmit={submit} />
            </div>
          )}
        </section>

        <aside
          aria-label="Your quote so far"
          className="max-h-56 w-full shrink-0 overflow-y-auto border-t border-gray-200 bg-white p-5 md:max-h-none md:w-80 md:border-l md:border-t-0"
        >
          <h3 className="text-base font-semibold text-gray-900">Your quote so far</h3>
          <p className="mt-1 text-xs text-gray-500">Your answers appear here as you give them.</p>
          {QUESTION_GROUPS.map((group) => (
            <div key={group} className="mt-4">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-indigo-600">{group}</h4>
              <dl className="mt-2 space-y-1.5">
                {QUESTIONS.map((item, index) =>
                  item.group !== group ? null : (
                    <div
                      key={item.id}
                      aria-current={index === step ? "step" : undefined}
                      className={`flex justify-between gap-3 rounded px-1 text-sm ${index === step ? "bg-indigo-50" : ""}`}
                    >
                      <dt className="text-gray-600">{item.label}</dt>
                      <dd className={index < step ? "text-right font-medium text-gray-900" : "text-gray-400"}>
                        {index < step ? item.display(answers) : "—"}
                      </dd>
                    </div>
                  ),
                )}
              </dl>
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
}
