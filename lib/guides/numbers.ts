import data from './fixtures.json';
const values: Record<string, number> = data.values;
export const money = (key: string) => {
  if (!(key in values)) throw new Error(`Missing editorial value: ${key}`);
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(values[key]);
};
export const percent = (key: string, digits = 4) => {
  if (!(key in values)) throw new Error(`Missing editorial value: ${key}`);
  return `${values[key].toFixed(digits)}%`;
};
