import { Analysis } from 'common-spectrum';
import type { InputData, ParseOptions } from 'spc-parser';
import { parse } from 'spc-parser';

import { spectrumCallback } from './utils/spectrumCallback.ts';

/**
 * Creates a new Analysis from an SPC file: Thermo Galactic GRAMS, Shimadzu
 * UVProbe (OLE2 and flat) or PerkinElmer `.sp` (binary and ASCII), the format
 * being auto-detected.
 * @param data - SPC file content as ArrayBuffer, Buffer, or ArrayBufferView.
 * @param options - Options forwarded to spc-parser (e.g. `timeZone`, `encoding`).
 * @returns A new Analysis instance with one spectrum per dataset in the file.
 */
export function fromSPC(data: InputData, options: ParseOptions = {}): Analysis {
  const result = parse(data, options);

  const analysis = new Analysis({ spectrumCallback });

  // UVProbe OLE spectra already carry their own dataset metadata
  const fileMeta = 'datasets' in result.meta ? {} : result.meta;

  for (const spectrum of result.spectra) {
    const meta: Record<string, unknown> = { ...fileMeta, ...spectrum.meta };
    analysis.pushSpectrum(spectrum.variables, {
      dataType: 'UV spectrum',
      title: getTitle(meta),
      meta,
    });
  }

  return analysis;
}

/**
 * Picks the title of a spectrum: the UVProbe sample title, else the
 * PerkinElmer dataset name.
 * @param meta - merged file and spectrum metadata.
 * @returns The title, `''` when the file has none.
 */
function getTitle(meta: Record<string, unknown>): string {
  const { title, name } = meta;
  if (typeof title === 'string') return title;
  return typeof name === 'string' ? name : '';
}
