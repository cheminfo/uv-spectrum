import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { assert, expect, test } from 'vitest';

import { fromJcamp, fromText, toJcamp } from '../../index.ts';

test('fromText', () => {
  const data = readFileSync(join(import.meta.dirname, 'data/uv.txt')).buffer;
  const analysis = fromText(data, {
    info: {
      xUnits: 'cm-1',
      yUnits: '',
      xLabel: 'Wavenumber',
      yLabel: 'Intensity',
    },
  });

  expect(analysis.spectra).toHaveLength(1);

  const first = analysis.spectra[0];
  assert(first !== undefined);

  expect(first.dataType).toBe('UV spectrum');
  expect(first.variables.x.data).toHaveLength(551);
  expect(first.variables.y.data).toHaveLength(551);
  expect(first.variables.x.label).toBe('Wavenumber');
  expect(first.variables.x.units).toBe('cm-1');
  expect(first.variables.y.label).toBe('Intensity');
  expect(first.variables.y.units).toBe('');
});

test('fromText roundtrip via toJcamp', () => {
  const data = readFileSync(join(import.meta.dirname, 'data/uv.txt')).buffer;
  const analysis = fromText(data, {
    info: {
      xUnits: 'cm-1',
      yUnits: '',
      xLabel: 'Wavenumber',
      yLabel: 'Intensity',
    },
  });

  const jcamp = toJcamp(analysis);

  expect(jcamp).toContain('UV spectrum');

  const reloaded = fromJcamp(jcamp);

  expect(reloaded.spectra).toHaveLength(1);

  const first = reloaded.spectra[0];
  assert(first !== undefined);

  expect(first.dataType).toBe('UV spectrum');
});
