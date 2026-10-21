import type { TextData } from 'cheminfo-types';
import { fromJcamp as commonFromJcamp } from 'common-spectrum';

import { spectrumCallback } from './utils/spectrumCallback.ts';

/**
 * Creates a new Analysis from a JCAMP-DX string or buffer.
 * @param jcamp - JCAMP-DX data as string, ArrayBuffer or typed array.
 * @param options - Options forwarded to common-spectrum's fromJcamp.
 * @returns A new Analysis instance with UV-specific variables.
 */
export function fromJcamp(
  jcamp: TextData,
  options: Record<string, unknown> = {},
) {
  return commonFromJcamp(jcamp, { ...options, spectrumCallback });
}
