import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import type { Analysis } from 'common-spectrum';
import { expect, test } from 'vitest';

import {
  from,
  fromCaryEclipseCSV,
  fromJcamp,
  fromSPC,
  fromText,
} from '../../index.ts';

function read(name: string): Buffer {
  return readFileSync(join(import.meta.dirname, 'data', name));
}

function variablesOf(analysis: Analysis) {
  return analysis.spectra.map((spectrum) => spectrum.variables);
}

test.each([
  ['uv.jdx', fromJcamp],
  ['uv.sp', fromSPC],
  ['uv-ascii.sp', fromSPC],
  ['uv-ascii.txt', fromSPC],
  ['uvprobe-flat.spc', fromSPC],
  ['uvprobe-ole.spc', fromSPC],
  ['cary-eclipse.csv', fromCaryEclipseCSV],
  ['uv.txt', fromText],
])('%s is read like %o reads it', (name, reader) => {
  const data = read(name);

  const analysis = from(data);

  expect(analysis.spectra.length).toBeGreaterThan(0);
  expect(variablesOf(analysis)).toStrictEqual(variablesOf(reader(data)));
});

test('the number of spectra follows the detected format', () => {
  expect(from(read('cary-eclipse.csv')).spectra).toHaveLength(4);
  expect(from(read('uv-ascii.sp')).spectra[0]?.title).toBe('B.SP');
  expect(from(read('uvprobe-ole.spc')).spectra[0]?.title).toBe(
    '200 uM HCHO DNPH',
  );
});

test('text formats are recognised from a string too', () => {
  const jcamp = from(read('uv.jdx').toString('utf8'));
  const ascii = from(read('uv-ascii.sp').toString('latin1'));

  expect(jcamp.spectra[0]?.variables.y.label).toBe('Reflectance');
  expect(ascii.spectra[0]?.variables.x.data).toHaveLength(601);
});

test('a truncated SPC file throws instead of being read as text', () => {
  const data = read('uv.sp').subarray(0, 1000);

  expect(() => from(data)).toThrow(
    expect.objectContaining({ name: 'SpcParserError', code: 'TRUNCATED' }),
  );
});

test('the spc options reach spc-parser', () => {
  expect(() =>
    from(read('uv-ascii.sp'), { spc: { encoding: 'nope' } }),
  ).toThrow('Unsupported encoding option: "nope"');
});
