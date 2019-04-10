import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

import { fromJcamp } from '..';

import { Spectra } from '../Spectra';

const testFilesDir = '../../testFiles/xtc';
test('Load set of data', () => {
  let files = readdirSync(join(__dirname, testFilesDir)).filter((file) =>
    file.match(/0140|0189|0235/)
  );

  let spectra = new Spectra({ from: 800, to: 4000, numberOfPoints: 1024 });
  for (let file of files) {
    let jcamp = readFileSync(join(__dirname, testFilesDir, file), 'utf8');
    let spectrum = fromJcamp(jcamp);
    spectra.addSpectrum(spectrum, file.replace('.jdx', ''));
  }

  expect(spectra.data).toHaveLength(45);
  spectra.getNormalizedData();
  expect(spectra.getNormalizedData()).toMatchSnapshot();
});
