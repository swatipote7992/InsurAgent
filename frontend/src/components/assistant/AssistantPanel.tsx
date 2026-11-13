import { useEffect, useRef, useState, type RefObject, type SyntheticEvent } from "react";
import { ASSISTANT_ACTIONS, type AssistantAction, type ChatMessage } from "../../models/assistant";

interface AssistantPanelProps {
  id: string;
  messages: ChatMessage[];
  sending: boolean;
  /** True while the opening menu of quick actions is shown. */
  showActions: boolean;
  onAction: (action: AssistantAction) => void;
  onSend: (text: string) => void;
  onClose: () => void;
  inputRef: RefObject<HTMLInputElement | null>;
}

/** Questions offered before the visitor has said anything. */
const SUGGESTIONS = ["How do I get a quote?", "What does excess mean?", "What is a referral?"];

function Sparkle({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 2l1.9 5.6L19.5 9l-5.6 1.9L12 16.5l-1.9-5.6L4.5 9l5.6-1.4L12 2z" />
      <path d="M19 14l.9 2.6 2.6.9-2.6.9L19 21l-.9-2.6-2.6-.9 2.6-.9L19 14z" opacity="0.8" />
    </svg>
  );
}

function ActionIcon({ id }: { id: AssistantAction["id"] }) {
  const common = { viewBox: "0 0 24 24", className: "h-5 w-5", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (id === "ask") {
    return (
      <svg {...common}>
        <path d="M4 5h16v11H9l-5 4V5z" />
        <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.4" />
      </svg>
    );
  }
  if (id === "new-quote") {
    return (
      <svg {...common}>
        <path d="M12 5v14M5 12h14" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M5 7h14M5 12h14M5 17h9" />
    </svg>
  );
}

/** The chat window: header, quick actions, conversation, suggestions and the message box. */
export default function AssistantPanel({
  id,
  messages,
  sending,
  showActions,
  onAction,
  onSend,
  onClose,
  inputRef,
}: AssistantPanelProps) {
  const [draft, setDraft] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const hasConversation = messages.some((message) => message.role === "user");

  // Keep the newest message in view.
  useEffect(() => {
    endRef.current?.scrollIntoView?.({ block: "end" });
  }, [messages, sending]);

  function handleSubmit(event: SyntheticEvent) {
    event.preventDefault();
    const text = draft.trim();
    if (text === "" || sending) return;
    onSend(text);
    setDraft("");
  }

  return (
    <div
      id={id}
      role="dialog"
      aria-label="AI assistant"
      className="assistant-panel fixed bottom-24 right-6 z-50 flex h-[32rem] max-h-[calc(100vh-8rem)] w-[22rem] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl border border-white/60 bg-white"
    >
      <div className="assistant-header flex items-center gap-3 px-4 py-3 text-white">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 ring-1 ring-white/40">
          <Sparkle className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-semibold leading-tight">Assistant</h2>
          <p className="flex items-center gap-1.5 text-xs text-white/80">
            <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" />
            Demo mode
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close chat"
          className="rounded-full px-2.5 py-1 text-xl leading-none text-white/90 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          ×
        </button>
      </div>

      <div className="assistant-messages flex-1 overflow-y-auto p-4">
        <div role="log" aria-label="Conversation" className="space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`assistant-message flex items-end gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.role === "assistant" && (
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                  <Sparkle className="h-4 w-4" />
                </span>
              )}
              <p
                className={
                  message.role === "user"
                    ? "assistant-bubble-user max-w-[80%] rounded-2xl rounded-br-sm px-3.5 py-2 text-sm text-white shadow-sm"
                    : "max-w-[80%] rounded-2xl rounded-bl-sm bg-white px-3.5 py-2 text-sm text-gray-800 shadow-sm ring-1 ring-gray-100"
                }
              >
                <span className="sr-only">{message.role === "user" ? "You: " : "Assistant: "}</span>
                {message.text}
              </p>
            </div>
          ))}
        </div>

        {showActions && (
          <div className="assistant-message mt-4 space-y-2" role="group" aria-label="What would you like to do?">
            {ASSISTANT_ACTIONS.map((action) => (
              <button
                key={action.id}
                type="button"
                onClick={() => onAction(action)}
                className="flex w-full items-center gap-3 rounded-xl border border-indigo-100 bg-white p-3 text-left shadow-sm transition hover:border-indigo-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600" aria-hidden="true">
                  <ActionIcon id={action.id} />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-gray-900">{action.label}</span>
                  <span className="block text-xs text-gray-500">{action.description}</span>
                </span>
              </button>
            ))}
          </div>
        )}

        {sending && (
          <div role="status" className="assistant-message mt-3 flex items-end gap-2">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
              <Sparkle className="h-4 w-4" />
            </span>
            <div className="flex gap-1 rounded-2xl rounded-bl-sm bg-white px-3.5 py-3 shadow-sm ring-1 ring-gray-100" aria-hidden="true">
              {[0, 1, 2].map((dot) => (
                <span
                  key={dot}
                  className="assistant-dot h-1.5 w-1.5 rounded-full bg-indigo-400"
                  style={{ animationDelay: `${dot * 0.15}s` }}
                />
              ))}
            </div>
            <span className="sr-only">The assistant is typing</span>
          </div>
        )}

        {!showActions && !hasConversation && !sending && (
          <div className="mt-4 flex flex-wrap gap-2" aria-label="Suggested questions" role="group">
            {SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => onSend(suggestion)}
                className="rounded-full border border-indigo-200 bg-white px-3 py-1.5 text-xs font-medium text-indigo-700 shadow-sm hover:bg-indigo-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
        <div ref={endRef} />
      </div>

      <form onSubmit={handleSubmit} className="border-t border-gray-100 bg-white p-3">
        <label htmlFor={`${id}-message`} className="sr-only">
          Message
        </label>
        <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 py-1 pl-4 pr-1 focus-within:border-indigo-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-200">
          <input
            id={`${id}-message`}
            ref={inputRef}
            type="text"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            autoComplete="off"
            placeholder="Ask me anything..."
            className="min-w-0 flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
          />
          <button
            type="submit"
            disabled={sending}
            aria-label="Send"
            className="assistant-bubble-user flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white shadow-sm hover:brightness-110 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </div>
        <p className="mt-2 text-center text-[11px] text-gray-400">Demo only. Answers are not connected to an AI model yet.</p>
      </form>
    </div>
  );
}
