import { readFileSync } from 'fs';
import { join } from 'path';

import { fromJcamp } from '../..';

test('fromJcamp absorbance', () => {
  const path = join(__dirname, '../../../testFiles/MS5093A.DX');
  const jcamp = readFileSync(path, 'utf8');
  const spectrum = fromJcamp(jcamp);
  expect(spectrum.wavelength).toHaveLength(911);
  expect(spectrum.absorbance).toHaveLength(911);
  expect(spectrum.transmittance).toHaveLength(911);
});
