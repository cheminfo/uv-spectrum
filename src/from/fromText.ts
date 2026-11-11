import type { TextData } from 'cheminfo-types';
import { fromText as commonFromText } from 'common-spectrum';

import { spectrumCallback } from './utils/spectrumCallback.ts';

/**
 * Creates a new Analysis from text data (CSV/TSV).
 * Sets dataType to 'UV spectrum' by default, and derives the same variables as
 * the other readers: absorbance and transmittance, or the reflectance-derived
 * quantities when the y label says reflectance.
 * @param data - Text data as ArrayBuffer or string.
 * @param options - Options forwarded to common-spectrum's fromText.
 * @returns A new Analysis instance with UV-specific variables.
 */
export function fromText(
  data: TextData,
  options: Record<string, unknown> = {},
) {
  const analysis = commonFromText(data, {
    dataType: 'UV spectrum',
    ...options,
  });
  for (const spectrum of analysis.spectra) {
    spectrumCallback(spectrum.variables);
  }
  return analysis;
}
