import type { MeasurementXYVariables } from 'cheminfo-types';
import { expect, test } from 'vitest';

import { spectrumCallback } from '../spectrumCallback.ts';

test('a transmittance in % given by the units gives the absorbance', () => {
  const variables: MeasurementXYVariables = {
    x: { data: [400, 500], label: 'Wavelength', units: 'nm' },
    y: { data: [10, 1], label: 'Transmittance', units: '%' },
  };

  spectrumCallback(variables);

  expect(variables.a?.data).toStrictEqual([1, 2]);
  expect(variables.t?.data).toStrictEqual([10, 1]);
});
