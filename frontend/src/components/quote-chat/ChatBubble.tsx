import type { ReactNode } from "react";

export function Sparkle({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 2l1.9 5.6L19.5 9l-5.6 1.9L12 16.5l-1.9-5.6L4.5 9l5.6-1.4L12 2z" />
      <path d="M19 14l.9 2.6 2.6.9-2.6.9L19 21l-.9-2.6-2.6-.9 2.6-.9L19 14z" opacity="0.8" />
    </svg>
  );
}

/** The three bouncing dots shown while the assistant is "typing" its next message. */
export function TypingBubble() {
  return (
    <div role="status" className="assistant-message flex items-end gap-2">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
        <Sparkle className="h-4 w-4" />
      </span>
      <div className="flex gap-1 rounded-2xl rounded-bl-sm bg-white px-4 py-3.5 shadow-sm ring-1 ring-gray-100" aria-hidden="true">
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
  );
}

interface ChatBubbleProps {
  from: "assistant" | "user";
  /** "problem" tints an assistant message that explains something to fix. */
  tone?: "normal" | "problem";
  children: ReactNode;
}

/** One message in the quote chat, styled like the messages in the small assistant panel. */
export default function ChatBubble({ from, tone = "normal", children }: ChatBubbleProps) {
  if (from === "user") {
    return (
      <div className="assistant-message flex justify-end">
        <p className="assistant-bubble-user max-w-[80%] rounded-2xl rounded-br-sm px-4 py-2 text-sm text-white shadow-sm">
          <span className="sr-only">You: </span>
          {children}
        </p>
      </div>
    );
  }
  return (
    <div className="assistant-message flex items-end gap-2">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
        <Sparkle className="h-4 w-4" />
      </span>
      <p
        className={`max-w-[85%] rounded-2xl rounded-bl-sm px-4 py-2 text-sm shadow-sm ring-1 ${
          tone === "problem" ? "bg-amber-50 text-amber-900 ring-amber-200" : "bg-white text-gray-800 ring-gray-100"
        }`}
        role={tone === "problem" ? "alert" : undefined}
      >
        <span className="sr-only">Assistant: </span>
        {children}
      </p>
    </div>
  );
}
