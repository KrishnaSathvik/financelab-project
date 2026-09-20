/** Calendar months clamp the original day to the destination month's last day. */
export function addCalendarMonths(date: Date, months: number): Date {
  if (!Number.isInteger(months) || !Number.isFinite(date.getTime())) throw new RangeError('A valid date and integer months are required.');
  const result = new Date(date);
  const day = result.getDate();
  result.setDate(1);
  result.setMonth(result.getMonth() + months);
  const last = new Date(result.getFullYear(), result.getMonth() + 1, 0).getDate();
  result.setDate(Math.min(day, last));
  return result;
}
export function yearsToMonths(years: number): number {
  const months = Math.round(years * 12);
  if (!Number.isFinite(years) || years < 0 || Math.abs(years * 12 - months) > 1e-7) throw new RangeError('Use a nonnegative whole number of months.');
  return months;
}
