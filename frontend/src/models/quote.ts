/** CSS class per status. The colours are defined in src/index.css. */
export const QUOTE_STATUS_CLASSES = {
  New: "status-new",
  InProgress: "status-in-progress",
  Referred: "status-referred",
  ReadyForPolicy: "status-ready-for-policy",
} as const;

export type QuoteStatus = keyof typeof QUOTE_STATUS_CLASSES;

export interface Quote {
  reference: string;
  status: QuoteStatus;
  policyholder: { full_name: string };
  vehicle: { make: string; model: string };
  cover: { cover_level: string };
  premium: { annual_total_gbp: number } | null;
}
