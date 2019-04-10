import { fromText } from '../..';

test('Parse a text', () => {
  const text = `
        1,2
        2,3
        3,4
    `;

  let spectrum = fromText(text);
  expect(spectrum.wavelength).toStrictEqual([1, 2, 3]);
  expect(spectrum.transmittance).toStrictEqual([2, 3, 4]);
  expect(spectrum.absorbance).toStrictEqual([
    -0.3010299956639812,
    -0.47712125471966244,
    -0.6020599913279624
  ]);
});

test('Parse a text with options', () => {
  const text = `
        1,2,3
        2,3,4
        3,4,5
    `;

  let spectrum = fromText(text, {
    xColumn: 1,
    yColumn: 2,
    kind: 'absorbance'
  });
  expect(spectrum.wavelength).toStrictEqual([2, 3, 4]);
  expect(spectrum.transmittance).toStrictEqual([0.001, 0.0001, 0.00001]);
  expect(spectrum.absorbance).toStrictEqual([3, 4, 5]);
});
