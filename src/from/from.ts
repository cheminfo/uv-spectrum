import type { TextData } from 'cheminfo-types';
import type { Analysis } from 'common-spectrum';
import { ensureString } from 'ensure-string';
import type { ParseOptions } from 'spc-parser';
import { SpcParserError } from 'spc-parser';

import { fromCaryEclipseCSV } from './fromCaryEclipseCSV.ts';
import { fromJcamp } from './fromJcamp.ts';
import { fromSPC } from './fromSPC.ts';
import { fromText } from './fromText.ts';

export interface FromOptions {
  /**
   * Options forwarded to `fromJcamp` for a JCAMP-DX file.
   * @default {}
   */
  jcamp?: Record<string, unknown>;
  /**
   * Options forwarded to spc-parser for an SPC or PerkinElmer file
   * (e.g. `timeZone`, `encoding`).
   * @default {}
   */
  spc?: ParseOptions;
  /**
   * Options forwarded to `fromText` for a CSV / TSV file.
   * @default {}
   */
  text?: Record<string, unknown>;
}

/**
 * Bytes decoded to recognise the text formats from their first lines.
 */
const headLength = 4096;

/**
 * Creates a new Analysis from a file in any supported format, recognised from
 * its content and never from its name. The formats are tried in this order:
 * JCAMP-DX (starts with `##`); the formats of spc-parser (Thermo Galactic and
 * Shimadzu UVProbe `.spc`, PerkinElmer `.sp` binary or ASCII); a Cary Eclipse
 * CSV export (a line of sample names, then `Wavelength (nm),…`); and otherwise
 * CSV / TSV text.
 * @param data - File content as string, ArrayBuffer or Uint8Array (Buffer).
 * @param options - Options of each reader.
 * @returns A new Analysis instance with UV-specific variables.
 */
export function from(data: TextData, options: FromOptions = {}): Analysis {
  const { jcamp = {}, spc = {}, text = {} } = options;
  const bytes = toBytes(data);
  const head = ensureString(bytes.subarray(0, headLength));

  if (/^\s*##/.test(head)) return fromJcamp(data, jcamp);
  try {
    return fromSPC(bytes, spc);
  } catch (error) {
    const isUnsupported =
      error instanceof SpcParserError && error.code === 'UNSUPPORTED_FORMAT';
    if (!isUnsupported) throw error;
  }
  if (isCaryEclipseCSV(head)) return fromCaryEclipseCSV(data);
  return fromText(data, text);
}

/**
 * Gets the bytes of the data, without copying an ArrayBuffer or a Uint8Array.
 * @param data - File content.
 * @returns The bytes.
 */
function toBytes(data: TextData): Uint8Array {
  if (typeof data === 'string') return new TextEncoder().encode(data);
  return data instanceof Uint8Array ? data : new Uint8Array(data);
}

/**
 * Recognises a Cary Eclipse CSV export: comma-separated sample names on the
 * first line and the `Wavelength (nm),…` column headers on the second.
 * @param head - Beginning of the file as text.
 * @returns True for a Cary Eclipse CSV export.
 */
function isCaryEclipseCSV(head: string): boolean {
  const [names = '', headers = ''] = head.split(/\r?\n/, 2);
  return names.includes(',') && headers.startsWith('Wavelength (nm),');
}
