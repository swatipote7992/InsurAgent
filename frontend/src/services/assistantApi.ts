export const ASSISTANT_GREETING =
  "Hi! I'm the InsurAgent assistant. Ask me a question and I'll do my best to help.";

export const ASSISTANT_NEW_QUOTE_PROMPT = "Great, let's create a new quote together. The questions will appear here.";

export const ASSISTANT_ASK_PROMPT = "Sure! What would you like to know? Type a question, or pick one of these:";

export const ASSISTANT_STUB_REPLY = "I'm not connected to an AI model yet, so I can't answer questions.";

/**
 * Asks the assistant a question and returns its answer.
 *
 * Step 1 only builds the screen, so this returns a fixed reply. When a real backend exists this is
 * the one function to change; the chat screen does not need to know where the answer comes from.
 */
export async function askAssistant(_question: string): Promise<string> {
  // A short pause so the "typing" dots are visible, as they will be with a real model.
  await new Promise((resolve) => setTimeout(resolve, 500));
  return ASSISTANT_STUB_REPLY;
}
