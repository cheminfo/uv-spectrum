import type { Analysis } from 'common-spectrum';
import type { InputData, ParseOptions } from 'spc-parser';

import { fromSPC } from './fromSPC.ts';

/**
 * Creates a new Analysis from a PerkinElmer `.sp` file, binary (`PEPE`) or
 * ASCII (`PEDS`). The parser auto-detects the format, so this is the same as
 * `fromSPC`.
 * @param data - SP file content as ArrayBuffer, Buffer, or ArrayBufferView.
 * @param options - Options forwarded to spc-parser (e.g. `encoding`).
 * @returns A new Analysis instance with one spectrum per dataset in the file.
 */
export function fromSP(data: InputData, options: ParseOptions = {}): Analysis {
  return fromSPC(data, options);
}
