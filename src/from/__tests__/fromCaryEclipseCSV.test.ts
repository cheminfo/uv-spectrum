import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { assert, expect, test } from 'vitest';

import { fromCaryEclipseCSV } from '../../index.ts';

test('fromCaryEclipseCSV', () => {
  const data = readFileSync(
    join(import.meta.dirname, 'data/cary-eclipse.csv'),
  ).buffer;
  const analysis = fromCaryEclipseCSV(data);

  expect(analysis.spectra).toHaveLength(4);

  // First sample: "Blank f"
  const blank = analysis.spectra[0];
  assert(blank !== undefined);

  expect(blank.title).toBe('Blank f');
  expect(blank.dataType).toBe('UV spectrum');
  expect(blank.variables.x.data).toHaveLength(151);
  expect(blank.variables.y.data).toHaveLength(151);
  expect(blank.variables.x.label).toBe('Wavelength');
  expect(blank.variables.x.units).toBe('nm');
  expect(blank.variables.y.label).toBe('Intensity');
  expect(blank.variables.y.units).toBe('a.u.');

  // Check meta from first metadata block
  expect(blank.meta?.Instrument).toBe('Cary Eclipse');
  expect(blank.meta?.['Data mode']).toBe('Fluorescence');
  expect(blank.meta?.['Scan mode']).toBe('Emission');
  expect(blank.meta?.['Collection Time']).toBe('26/02/2026 16:26:09');

  // Check data values
  expect(blank.variables.x.data[0]).toBe(450);
  expect(blank.variables.y.data[0]).toBeCloseTo(1.730437279, 5);

  // Second sample: "Sample3-1"
  const sample1 = analysis.spectra[1];
  assert(sample1 !== undefined);

  expect(sample1.title).toBe('Sample3-1');
  expect(sample1.variables.x.data).toHaveLength(151);
  expect(sample1.meta?.['Collection Time']).toBe('26/02/2026 16:27:29');

  // Third sample: "Sample3-2"
  const sample2 = analysis.spectra[2];
  assert(sample2 !== undefined);

  expect(sample2.title).toBe('Sample3-2');
  expect(sample2.meta?.['Collection Time']).toBe('26/02/2026 16:30:10');

  // Fourth sample: "Sample3-3"
  const sample3 = analysis.spectra[3];
  assert(sample3 !== undefined);

  expect(sample3.title).toBe('Sample3-3');
  expect(sample3.meta?.['Collection Time']).toBe('26/02/2026 16:31:52');
});
