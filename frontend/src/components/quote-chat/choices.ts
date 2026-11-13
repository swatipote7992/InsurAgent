export interface Option {
  value: string;
  label: string;
}

/*
 * Example answers for the dropdowns, built into the page for now.
 * A later step loads the real lists from the backend instead; the questions only use these exports.
 */

export const POSTCODE_AREAS: Option[] = [
  ["M", "Manchester"], ["LS", "Leeds"], ["B", "Birmingham"], ["EH", "Edinburgh"], ["CF", "Cardiff"],
  ["BS", "Bristol"], ["NE", "Newcastle"], ["SW", "London south-west"], ["G", "Glasgow"], ["NR", "Norwich"],
  ["L", "Liverpool"], ["S", "Sheffield"], ["E", "London east"], ["N", "London north"], ["W", "London west"],
  ["SE", "London south-east"], ["NG", "Nottingham"], ["LE", "Leicester"], ["CV", "Coventry"], ["OX", "Oxford"],
  ["CB", "Cambridge"], ["BN", "Brighton"], ["EX", "Exeter"], ["PL", "Plymouth"], ["AB", "Aberdeen"],
].map(([value, name]) => ({ value, label: `${value} (${name})` }));

export const LICENCE_TYPES: Option[] = [
  { value: "full_uk", label: "Full UK" },
  { value: "provisional", label: "Provisional" },
  { value: "eu_international", label: "EU / international" },
];

export const MAKES: Record<string, string[]> = {
  Ford: ["Fiesta", "Focus", "Puma", "Kuga"],
  Volkswagen: ["Golf", "Polo", "Passat", "Tiguan"],
  Toyota: ["Yaris", "Corolla", "Aygo", "RAV4"],
  Vauxhall: ["Corsa", "Astra", "Mokka"],
  Volvo: ["XC40", "XC60", "V60"],
  BMW: ["1 Series", "3 Series", "X1", "X3"],
  Renault: ["Clio", "Captur", "Megane"],
  Porsche: ["Macan", "Cayenne", "911"],
  Kia: ["Picanto", "Ceed", "Sportage"],
  Skoda: ["Fabia", "Octavia", "Superb", "Kodiaq"],
};

export const MILEAGE_BANDS: Option[] = [
  { value: "up_to_5000", label: "Up to 5,000" },
  { value: "5001_to_10000", label: "5,001 to 10,000" },
  { value: "10001_to_15000", label: "10,001 to 15,000" },
  { value: "over_15000", label: "Over 15,000" },
];

export const COVER_LEVELS: Option[] = [
  { value: "third_party_only", label: "Third party only" },
  { value: "third_party_fire_and_theft", label: "Third party, fire and theft" },
  { value: "comprehensive", label: "Comprehensive" },
];

export const EXCESS_AMOUNTS: Option[] = [0, 100, 250, 500].map((amount) => ({
  value: String(amount),
  label: `£${amount}`,
}));

/** Every car as one choice, for example "Ford Fiesta". The make is always the first word. */
export const CARS: Option[] = Object.entries(MAKES).flatMap(([make, models]) =>
  models.map((model) => ({ value: `${make} ${model}`, label: `${make} ${model}` })),
);
