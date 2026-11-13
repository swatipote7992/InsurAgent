import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import type { AssistantAction, ChatMessage } from "../../models/assistant";
import { ASSISTANT_ASK_PROMPT, ASSISTANT_GREETING, askAssistant } from "../../services/assistantApi";
import AssistantPanel from "./AssistantPanel";

const PANEL_ID = "assistant-panel";

let nextMessageId = 1;
const message = (role: ChatMessage["role"], text: string): ChatMessage => ({ id: nextMessageId++, role, text });

/** The floating button in the bottom-right corner and the chat panel it opens. */
export default function AssistantWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [message("assistant", ASSISTANT_GREETING)]);
  const [sending, setSending] = useState(false);
  const [showActions, setShowActions] = useState(true);
  const navigate = useNavigate();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Move focus into the message box when the panel opens.
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Escape closes the panel and returns focus to the button.
  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  function close() {
    setOpen(false);
    buttonRef.current?.focus();
  }

  function handleAction(action: AssistantAction) {
    if (action.kind === "ask") {
      setShowActions(false);
      setMessages((current) => [...current, message("assistant", ASSISTANT_ASK_PROMPT)]);
      inputRef.current?.focus();
      return;
    }
    close();
    navigate(action.to);
  }

  async function send(text: string) {
    setShowActions(false);
    setMessages((current) => [...current, message("user", text)]);
    setSending(true);
    let reply: string;
    try {
      reply = await askAssistant(text);
    } catch {
      reply = "Sorry, something went wrong. Please try again.";
    }
    setMessages((current) => [...current, message("assistant", reply)]);
    setSending(false);
  }

  return (
    <>
      {open && (
        <AssistantPanel
          id={PANEL_ID}
          messages={messages}
          sending={sending}
          showActions={showActions}
          onAction={handleAction}
          onSend={send}
          onClose={close}
          inputRef={inputRef}
        />
      )}
      <div className="fixed bottom-6 right-6 z-50 h-14 w-14">
        {!open && <span className="assistant-launcher-ring absolute inset-0 rounded-full" aria-hidden="true" />}
        <button
          ref={buttonRef}
          type="button"
          onClick={() => (open ? close() : setOpen(true))}
          aria-label={open ? "Close assistant" : "Open assistant"}
          aria-expanded={open}
          aria-controls={PANEL_ID}
          className="assistant-launcher relative flex h-14 w-14 items-center justify-center rounded-full text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2"
        >
          {open ? (
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor" aria-hidden="true">
              <path d="M12 2l1.9 5.6L19.5 9l-5.6 1.9L12 16.5l-1.9-5.6L4.5 9l5.6-1.4L12 2z" />
              <path d="M19 14l.9 2.6 2.6.9-2.6.9L19 21l-.9-2.6-2.6-.9 2.6-.9L19 14z" opacity="0.85" />
              <path d="M5 15l.7 1.9 1.9.7-1.9.7L5 20.2l-.7-1.9-1.9-.7 1.9-.7L5 15z" opacity="0.7" />
            </svg>
          )}
        </button>
      </div>
    </>
  );
}
