import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { assert, expect, test } from 'vitest';

import { fromSPC } from '../../index.ts';

test('fromSPC UVProbe OLE', () => {
  const data = readFileSync(join(import.meta.dirname, 'data/uvprobe-ole.spc'));
  const analysis = fromSPC(data, { timeZone: 'Europe/Zurich' });

  expect(analysis.spectra).toHaveLength(1);

  const first = analysis.spectra[0];
  assert(first !== undefined);

  expect(first.dataType).toBe('UV spectrum');
  expect(first.title).toBe('200 uM HCHO DNPH');
  expect(first.meta).toMatchObject({
    instrumentName: 'LRESE-UV2600',
    serialNumber: 'A116955',
  });

  const { x, y } = first.variables;

  expect(x.data).toHaveLength(1501);
  expect(y.data).toHaveLength(1501);
  expect(x.label).toBe('Wavelength');
  expect(x.units).toBe('nm');
  expect(y.label).toBe('Absorbance');
  expect(x.data[0]).toBe(300);
  expect(x.data[1500]).toBe(600);
  expect(y.data[0]).toBeCloseTo(0.273793, 6);
  expect(y.data[1500]).toBeCloseTo(-0.033829, 6);

  expect(Object.keys(first.variables)).toStrictEqual(['x', 'y', 'a', 't']);
});

test('fromSPC UVProbe flat', () => {
  const data = readFileSync(join(import.meta.dirname, 'data/uvprobe-flat.spc'));
  const analysis = fromSPC(data, { timeZone: 'Europe/Zurich' });

  expect(analysis.spectra).toHaveLength(1);

  const first = analysis.spectra[0];
  assert(first !== undefined);

  expect(first.dataType).toBe('UV spectrum');
  expect(first.title).toBe('');
  expect(first.meta).toMatchObject({ kind: 'flat' });

  const { x, y } = first.variables;

  expect(x.data).toHaveLength(1501);
  expect(x.label).toBe('Wavelength');
  expect(y.label).toBe('Absorbance');
  expect(x.data[0]).toBe(300);
  expect(x.data[1500]).toBe(600);
  expect(y.data[0]).toBeCloseTo(0.273793, 6);

  expect(Object.keys(first.variables)).toStrictEqual(['x', 'y', 'a', 't']);
});
