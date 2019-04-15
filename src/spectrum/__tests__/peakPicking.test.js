import { fromText } from '../..';

let text = `
1 0.7
2 0.6
3 0.5
4 0.6
5 0.7
6 0.2
7 0.4
  `;
describe('Test addPeaks', () => {
  it('default options', () => {
    let uvSpectrum = fromText(text);

    expect(uvSpectrum.peaks).toStrictEqual([]);
    uvSpectrum.peakPicking(3);
    expect(uvSpectrum.peaks).toStrictEqual([
      {
        absorbance: 0.3010299956639812,
        transmittance: 0.5,
        wavelength: 3
      }
    ]);
  });

  it('large range', () => {
    let uvSpectrum = fromText(text);

    uvSpectrum.peaks = [];
    uvSpectrum.peakPicking(3, { range: 10 });
    expect(uvSpectrum.peaks).toStrictEqual([
      {
        absorbance: 0.6989700043360187,
        transmittance: 0.2,
        wavelength: 6
      }
    ]);
  });

  it('small range', () => {
    let uvSpectrum = fromText(text);

    uvSpectrum.peaks = [];
    uvSpectrum.peakPicking(4, { range: 1 });
    expect(uvSpectrum.peaks).toStrictEqual([
      {
        absorbance: 0.3010299956639812,
        transmittance: 0.5,
        wavelength: 3
      }
    ]);
  });

  it('test optimize', () => {
    let uvSpectrum = fromText(text);

    uvSpectrum.peakPicking(7, { optimize: true });
    uvSpectrum.peakPicking(1, { optimize: true });
    expect(uvSpectrum.peaks).toStrictEqual([
      {
        absorbance: 0.6989700043360187,
        transmittance: 0.2,
        wavelength: 6
      },
      {
        absorbance: 0.3010299956639812,
        transmittance: 0.5,
        wavelength: 3
      }
    ]);
  });

  it('test duplicate', () => {
    let uvSpectrum = fromText(text);

    uvSpectrum.peakPicking(3, { range: 1 });
    uvSpectrum.peakPicking(3, { optimize: true });
    expect(uvSpectrum.peaks).toStrictEqual([
      {
        absorbance: 0.3010299956639812,
        transmittance: 0.5,
        wavelength: 3
      }
    ]);
  });
});
