export function rateFieldMessage(value: number, high = 20) {
  if (value < 0) return { error: "Interest rate must be 0% or higher." };
  if (value > high) {
    return { warning: "This is unusually high. Check that the value is correct." };
  }
  return {};
}

export function percentFieldMessage(value: number, high = 30, label = "This value") {
  if (!Number.isFinite(value)) return { error: `${label} must be a finite number.` };
  if (value <= -100) return { error: `${label} must be greater than -100%.` };
  if (value > high) {
    return { warning: "This is unusually high. Check that the value is correct." };
  }
  return {};
}

export function nonNegativeMessage(value: number, label: string) {
  if (value < 0) return { error: `${label} must be 0 or higher.` };
  return {};
}
