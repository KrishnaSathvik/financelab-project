import { InputValidationError } from '@/lib/validation/index';
/** UI adapter: engines reject invalid inputs; views show errors instead of stale results. */
export function evaluateCalculation<T>(calculate: () => T): { result: T | null; error: string | null } {
  try { return { result: calculate(), error: null }; }
  catch (error) {
    if (error instanceof InputValidationError) return { result: null, error: error.message };
    throw error;
  }
}
