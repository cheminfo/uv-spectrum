import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { assert, expect, test } from 'vitest';

import { fromSP } from '../../index.ts';

test('fromSP', () => {
  const data = readFileSync(join(import.meta.dirname, 'data/uv.sp'));
  const analysis = fromSP(data);

  expect(analysis.spectra).toHaveLength(1);

  const first = analysis.spectra[0];
  assert(first !== undefined);

  expect(first.dataType).toBe('UV spectrum');
  expect(first.variables.x.data).toHaveLength(81);
  expect(first.variables.y.data).toHaveLength(81);
  expect(first.title).toBe(
    String.raw`C:\Trinity\Data\Reference Data\Color (ASTM E 308)\Illuminant_A.sp`,
  );
  expect(first.variables.x.label).toBe('Wavelength');
  expect(first.variables.x.units).toBe('nm');
  expect(first.variables.y.label).toBe('nm');

  // Data is sorted by ascending x (spectrumCallback reorders)
  expect(first.variables.x.data[0]).toBe(380);
  expect(first.variables.x.data[80]).toBe(780);
  expect(first.variables.y.data[0]).toBeCloseTo(9.8, 1);
  expect(first.variables.y.data[80]).toBeCloseTo(241.68, 1);

  // spectrumCallback adds absorbance and transmittance variables
  expect(Object.keys(first.variables)).toStrictEqual(['x', 'y', 'a', 't']);
});

test('fromSP ASCII (PEDS)', () => {
  const data = readFileSync(join(import.meta.dirname, 'data/uv-ascii.sp'));
  const analysis = fromSP(data);

  expect(analysis.spectra).toHaveLength(1);

  const first = analysis.spectra[0];
  assert(first !== undefined);

  expect(first.dataType).toBe('UV spectrum');
  expect(first.title).toBe('B.SP');
  expect(first.meta).toStrictEqual({
    kind: 'peds',
    description: 'PE UV SPECTRUM ASCII PEDS 1.60',
    xUnits: 'NM',
    name: 'B.SP',
    creationDate: '25/12/05 16:36:30.00',
    modificationDate: '25/12/05 16:39:24.00',
    analyst: 'Simon',
  });

  const { x, y, a, t } = first.variables;
  assert(a !== undefined && t !== undefined);

  expect(x.data).toHaveLength(601);
  expect(y.data).toHaveLength(601);
  expect(x.label).toBe('Wavelength');
  expect(x.units).toBe('nm');
  expect(y.label).toBe('Absorbance');

  // The file stores 800 → 200 nm, the analysis is sorted by ascending x
  expect(x.data[0]).toBe(200);
  expect(x.data[600]).toBe(800);
  expect(y.data[0]).toBe(0.671629);
  expect(y.data[600]).toBe(0.00266);

  expect(Object.keys(first.variables)).toStrictEqual(['x', 'y', 'a', 't']);
  expect(a.data[0]).toBe(0.671629);
  expect(t.data[0]).toBeCloseTo(21.2996, 4);
});

test('fromSP ASCII (PEDS) saved as .txt', () => {
  const data = readFileSync(join(import.meta.dirname, 'data/uv-ascii.txt'));
  const reference = readFileSync(join(import.meta.dirname, 'data/uv-ascii.sp'));

  const first = fromSP(data).spectra[0];
  const expected = fromSP(reference).spectra[0];
  assert(first !== undefined && expected !== undefined);

  expect(first.title).toBe('B.TXT');
  expect(first.meta).toMatchObject({
    name: 'B.TXT',
    modificationDate: '25/12/05 16:44:39.00',
  });
  expect(first.variables.x.data).toHaveLength(601);
  expect(first.variables).toStrictEqual(expected.variables);
});
