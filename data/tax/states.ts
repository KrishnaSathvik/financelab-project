export type StateTaxOption = {
  code: string;
  name: string;
  rate: number;
  note?: string;
};

export const stateTaxOptions: StateTaxOption[] = [
  { code: "NONE", name: "No state income tax / skip", rate: 0 },
  { code: "AL", name: "Alabama", rate: 0.05 },
  { code: "AK", name: "Alaska", rate: 0 },
  { code: "AZ", name: "Arizona", rate: 0.025 },
  { code: "AR", name: "Arkansas", rate: 0.039 },
  { code: "CA", name: "California", rate: 0.06, note: "Approximate blended rate" },
  { code: "CO", name: "Colorado", rate: 0.044 },
  { code: "CT", name: "Connecticut", rate: 0.05, note: "Approximate blended rate" },
  { code: "DE", name: "Delaware", rate: 0.055 },
  { code: "FL", name: "Florida", rate: 0 },
  { code: "GA", name: "Georgia", rate: 0.0539 },
  { code: "HI", name: "Hawaii", rate: 0.07, note: "Approximate blended rate" },
  { code: "ID", name: "Idaho", rate: 0.058 },
  { code: "IL", name: "Illinois", rate: 0.0495 },
  { code: "IN", name: "Indiana", rate: 0.03 },
  { code: "IA", name: "Iowa", rate: 0.038 },
  { code: "KS", name: "Kansas", rate: 0.052 },
  { code: "KY", name: "Kentucky", rate: 0.04 },
  { code: "LA", name: "Louisiana", rate: 0.03 },
  { code: "ME", name: "Maine", rate: 0.058 },
  { code: "MD", name: "Maryland", rate: 0.0475 },
  { code: "MA", name: "Massachusetts", rate: 0.05 },
  { code: "MI", name: "Michigan", rate: 0.0425 },
  { code: "MN", name: "Minnesota", rate: 0.07, note: "Approximate blended rate" },
  { code: "MS", name: "Mississippi", rate: 0.044 },
  { code: "MO", name: "Missouri", rate: 0.047 },
  { code: "MT", name: "Montana", rate: 0.059 },
  { code: "NE", name: "Nebraska", rate: 0.055 },
  { code: "NV", name: "Nevada", rate: 0 },
  { code: "NH", name: "New Hampshire", rate: 0 },
  { code: "NJ", name: "New Jersey", rate: 0.055, note: "Approximate blended rate" },
  { code: "NM", name: "New Mexico", rate: 0.049 },
  { code: "NY", name: "New York", rate: 0.06, note: "Approximate blended rate" },
  { code: "NC", name: "North Carolina", rate: 0.0425 },
  { code: "ND", name: "North Dakota", rate: 0.0225 },
  { code: "OH", name: "Ohio", rate: 0.035 },
  { code: "OK", name: "Oklahoma", rate: 0.0475 },
  { code: "OR", name: "Oregon", rate: 0.08, note: "Approximate blended rate" },
  { code: "PA", name: "Pennsylvania", rate: 0.0307 },
  { code: "RI", name: "Rhode Island", rate: 0.0499 },
  { code: "SC", name: "South Carolina", rate: 0.062 },
  { code: "SD", name: "South Dakota", rate: 0 },
  { code: "TN", name: "Tennessee", rate: 0 },
  { code: "TX", name: "Texas", rate: 0 },
  { code: "UT", name: "Utah", rate: 0.0455 },
  { code: "VT", name: "Vermont", rate: 0.066 },
  { code: "VA", name: "Virginia", rate: 0.0575 },
  { code: "WA", name: "Washington", rate: 0 },
  { code: "WV", name: "West Virginia", rate: 0.0482 },
  { code: "WI", name: "Wisconsin", rate: 0.053 },
  { code: "WY", name: "Wyoming", rate: 0 },
  { code: "DC", name: "Washington, D.C.", rate: 0.065, note: "Approximate blended rate" },
];

export function getStateTax(code: string) {
  return stateTaxOptions.find((item) => item.code === code) ?? stateTaxOptions[0];
}
