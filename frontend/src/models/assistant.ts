/** A quick action offered on the assistant's opening screen. */
export type AssistantAction =
  | { id: "ask"; label: string; description: string; kind: "ask" }
  | { id: "new-quote"; label: string; description: string; kind: "new-quote" }
  | { id: "recent-quotes"; label: string; description: string; kind: "navigate"; to: string };

export const ASSISTANT_ACTIONS: readonly AssistantAction[] = [
  { id: "ask", label: "Ask a question", description: "Get help with quotes, cover or excess", kind: "ask" },
  { id: "new-quote", label: "Create a new quote", description: "Start a car insurance quote", kind: "new-quote" },
  { id: "recent-quotes", label: "See recent quotes", description: "Open the quotes list on the home page", kind: "navigate", to: "/" },
];

export interface ChatMessage {
  id: number;
  role: "user" | "assistant";
  text: string;
}
