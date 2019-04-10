import { readFileSync } from 'fs';
import { join } from 'path';

import { fromJcamp } from '../..';

test('fromJcamp absorbance', () => {
  const path = join(__dirname, '../../../testFiles/absorbance.jdx');
  const jcamp = readFileSync(path, 'utf8');
  const spectrum = fromJcamp(jcamp);
  expect(spectrum.wavelength).toHaveLength(1738);
  expect(spectrum.absorbance).toHaveLength(1738);
  expect(spectrum.transmittance).toHaveLength(1738);
});

test('fromJcamp transmittance', () => {
  const path = join(__dirname, '../../../testFiles/transmittance1.jdx');
  const jcamp = readFileSync(path, 'utf8');
  const spectrum = fromJcamp(jcamp);
  expect(spectrum.wavelength).toHaveLength(1991);
  expect(spectrum.absorbance).toHaveLength(1991);
  expect(spectrum.transmittance).toHaveLength(1991);
});
