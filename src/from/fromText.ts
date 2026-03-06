import type { TextData } from 'cheminfo-types';
import { fromText as commonFromText } from 'common-spectrum';

/**
 * Creates a new Analysis from text data (CSV/TSV).
 * Sets dataType to 'UV spectrum' by default.
 * @param data - Text data as ArrayBuffer or string.
 * @param options - Options forwarded to common-spectrum's fromText.
 * @returns A new Analysis instance with UV-specific variables.
 */
export function fromText(
  data: TextData,
  options: Record<string, unknown> = {},
) {
  return commonFromText(data, {
    dataType: 'UV spectrum',
    ...options,
  });
}
