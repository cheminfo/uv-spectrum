import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { getNormalizedSpectrum } from 'common-spectrum';
import { assert, expect, test } from 'vitest';

import { fromJcamp } from '../../index.ts';

test('fromJcamp', () => {
  const data = readFileSync(join(import.meta.dirname, 'data/uv.jdx')).buffer;
  const analysis = fromJcamp(data, {
    info: {
      xUnits: 'cm-1',
      yUnits: '',
      xLabel: 'Wavenumber',
      yLabel: 'Intensity',
      dataType: 'UV spectrum',
    },
  });

  expect(analysis.spectra).toHaveLength(1);

  const first = analysis.spectra[0];
  assert(first !== undefined);

  expect(Object.keys(first.variables)).toHaveLength(6);

  expect(first.variables.x.data).toHaveLength(501);
  expect(first.variables.y.data).toHaveLength(501);
  expect(first.variables.x.label).toBe('wavelength');
  expect(first.variables.x.units).toBe('nm');
  expect(first.variables.y.label).toBe('Reflectance');
  expect(first.variables.y.units).toBeUndefined();

  const spectrumTauc = analysis.getXYSpectrum({ variables: 'c vs e' });
  assert(spectrumTauc !== undefined);

  const normalizedTauc = getNormalizedSpectrum(spectrumTauc, {
    from: 2.5,
    to: 3.5,
  }).variables;

  expect(normalizedTauc.x.data).toHaveLength(141);
  expect(normalizedTauc.y.data).toHaveLength(141);
});
