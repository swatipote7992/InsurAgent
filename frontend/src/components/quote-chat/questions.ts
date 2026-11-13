import { CARS, COVER_LEVELS, EXCESS_AMOUNTS, LICENCE_TYPES, MILEAGE_BANDS, POSTCODE_AREAS, type Option } from "./choices";
import { addDays, ageOn, formatDate, isIsoDate, todayIso } from "./dates";

/** The answers given so far, by question id. */
export type Answers = Record<string, string>;

/** Which control the visitor uses to answer. */
export type Control =
  | { kind: "text"; inputType: "text" | "email"; placeholder?: string; numeric?: boolean }
  | { kind: "date"; min?: string; max?: string }
  | { kind: "number"; min: number; max: number; placeholder?: string }
  | { kind: "select"; options: Option[] };

export type QuestionGroup = "Your details" | "Your car" | "Your cover";

export interface Question {
  id: string;
  /** Short name: the control's accessible name and the label in the summary. */
  label: string;
  group: QuestionGroup;
  /** The assistant's wording. It can use earlier answers. */
  prompt: (answers: Answers) => string;
  control: (answers: Answers) => Control;
  /** The answer as shown in the chat and in the summary. */
  display: (answers: Answers) => string;
  /** A plain-words problem with the draft answer, or null when it is fine. `answers` are the earlier ones. */
  validate: (draft: string, answers: Answers) => string | null;
}

const MIN_AGE = 17;
const MAX_AGE = 100;
const MAX_COUNT = 10;
const YEAR_MIN = 1980;
const START_WINDOW_DAYS = 30;
const MAX_NAME_LENGTH = 100;
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

const text = (answers: Answers, id: string): string => answers[id] ?? "";

const labelOf = (options: Option[], value: string): string => options.find((o) => o.value === value)?.label ?? value;

const firstName = (answers: Answers): string => text(answers, "fullName").trim().split(/\s+/)[0] ?? "";

/** The most years of licence the date of birth allows on the start date, or null if either is not known yet. */
function maxLicenceYears(answers: Answers): number | null {
  const start = text(answers, "startDate");
  const born = text(answers, "dob");
  if (!isIsoDate(start) || !isIsoDate(born)) return null;
  return Math.max(0, ageOn(born, start) - MIN_AGE);
}

function wholeNumber(draft: string, low: number, high: number, hint = ""): string | null {
  const value = draft.trim();
  if (value === "") return "Please type your answer.";
  if (!/^\d+$/.test(value) || Number(value) < low || Number(value) > high) {
    return `Please enter a whole number from ${low} to ${high}${hint}.`;
  }
  return null;
}

const chosen = (draft: string): string | null => (draft === "" ? "Please choose one of the options." : null);

const plain = (id: string) => (answers: Answers) => text(answers, id);

export const QUESTIONS: readonly Question[] = [
  {
    id: "startDate",
    label: "Start date",
    group: "Your cover",
    prompt: () => {
      const first = formatDate(todayIso());
      const last = formatDate(addDays(todayIso(), START_WINDOW_DAYS));
      return `First, when would you like your cover to start? Choose a date between ${first} and ${last}.`;
    },
    control: () => ({ kind: "date", min: todayIso(), max: addDays(todayIso(), START_WINDOW_DAYS) }),
    display: (a) => formatDate(text(a, "startDate")),
    validate: (draft) => {
      if (draft === "") return "Please choose a date.";
      const first = todayIso();
      const last = addDays(first, START_WINDOW_DAYS);
      if (!isIsoDate(draft) || draft < first || draft > last) {
        return `Please choose a date between ${formatDate(first)} and ${formatDate(last)}.`;
      }
      return null;
    },
  },
  {
    id: "fullName",
    label: "Full name",
    group: "Your details",
    prompt: () => "Great. What is your full name?",
    control: () => ({ kind: "text", inputType: "text", placeholder: "For example, Alex Morgan" }),
    display: plain("fullName"),
    validate: (draft) => {
      const value = draft.trim();
      if (value === "") return "Please type your full name.";
      if (value.length > MAX_NAME_LENGTH) return `Please use at most ${MAX_NAME_LENGTH} characters.`;
      return null;
    },
  },
  {
    id: "dob",
    label: "Date of birth",
    group: "Your details",
    prompt: (a) => `Thanks, ${firstName(a)}. What is your date of birth?`,
    control: () => ({ kind: "date", max: todayIso() }),
    display: (a) => formatDate(text(a, "dob")),
    validate: (draft, a) => {
      if (draft === "") return "Please choose a date.";
      if (!isIsoDate(draft)) return "Please enter a valid date.";
      if (draft >= todayIso()) return "Your date of birth must be in the past.";
      const age = ageOn(draft, text(a, "startDate"));
      if (age < MIN_AGE) return `You must be at least ${MIN_AGE} when the policy starts.`;
      if (age > MAX_AGE) return `Please check your date of birth. The oldest age we can quote is ${MAX_AGE}.`;
      return null;
    },
  },
  {
    id: "email",
    label: "Email",
    group: "Your details",
    prompt: () => "What email address should we use for this quote?",
    control: () => ({ kind: "text", inputType: "email", placeholder: "name@example.com" }),
    display: plain("email"),
    validate: (draft) => {
      const value = draft.trim();
      if (value === "") return "Please type your email address.";
      if (!EMAIL.test(value)) return "Please enter a valid email address, for example name@example.com.";
      return null;
    },
  },
  {
    id: "postcode",
    label: "Postcode area",
    group: "Your details",
    prompt: () => "Which postcode area do you live in?",
    control: () => ({ kind: "select", options: POSTCODE_AREAS }),
    display: (a) => labelOf(POSTCODE_AREAS, text(a, "postcode")),
    validate: chosen,
  },
  {
    id: "licenceType",
    label: "Licence type",
    group: "Your details",
    prompt: () => "What type of driving licence do you hold?",
    control: () => ({ kind: "select", options: LICENCE_TYPES }),
    display: (a) => labelOf(LICENCE_TYPES, text(a, "licenceType")),
    validate: chosen,
  },
  {
    id: "licenceYears",
    label: "Years licence held",
    group: "Your details",
    prompt: (a) => {
      const most = maxLicenceYears(a);
      return `How many years have you held your licence?${most === null ? "" : ` (0 to ${most}, based on your date of birth)`}`;
    },
    control: () => ({ kind: "text", inputType: "text", numeric: true, placeholder: "Whole years, for example 5" }),
    display: (a) => {
      const years = text(a, "licenceYears");
      return `${years} ${years === "1" ? "year" : "years"}`;
    },
    validate: (draft, a) => {
      const most = maxLicenceYears(a);
      return wholeNumber(draft, 0, most ?? 90, most === null ? "" : " for your date of birth");
    },
  },
  {
    id: "claims",
    label: "Claims (5 years)",
    group: "Your details",
    prompt: () => `How many claims have you made in the last 5 years? (0 to ${MAX_COUNT})`,
    control: () => ({ kind: "number", min: 0, max: MAX_COUNT }),
    display: plain("claims"),
    validate: (draft) => wholeNumber(draft, 0, MAX_COUNT),
  },
  {
    id: "car",
    label: "Car",
    group: "Your car",
    prompt: () => "Now your car. Which one is it?",
    control: () => ({ kind: "select", options: CARS }),
    display: plain("car"),
    validate: chosen,
  },
  {
    id: "year",
    label: "Year",
    group: "Your car",
    prompt: () => `What year was it manufactured? (${YEAR_MIN} to ${new Date().getFullYear()})`,
    control: () => ({ kind: "text", inputType: "text", numeric: true, placeholder: "For example, 2019" }),
    display: plain("year"),
    validate: (draft) => wholeNumber(draft, YEAR_MIN, new Date().getFullYear()),
  },
  {
    id: "mileage",
    label: "Annual mileage",
    group: "Your car",
    prompt: () => "How many miles do you drive each year?",
    control: () => ({ kind: "select", options: MILEAGE_BANDS }),
    display: (a) => labelOf(MILEAGE_BANDS, text(a, "mileage")),
    validate: chosen,
  },
  {
    id: "coverLevel",
    label: "Cover level",
    group: "Your cover",
    prompt: () => "Which level of cover would you like?",
    control: () => ({ kind: "select", options: COVER_LEVELS }),
    display: (a) => labelOf(COVER_LEVELS, text(a, "coverLevel")),
    validate: chosen,
  },
  {
    id: "excess",
    label: "Voluntary excess",
    group: "Your cover",
    prompt: () => "Last question. How much voluntary excess would you like to pay if you claim?",
    control: () => ({ kind: "select", options: EXCESS_AMOUNTS }),
    display: (a) => labelOf(EXCESS_AMOUNTS, text(a, "excess")),
    validate: chosen,
  },
];

export const QUESTION_GROUPS: readonly QuestionGroup[] = ["Your details", "Your car", "Your cover"];
