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
    let irSpectrum = fromText(text);

    expect(irSpectrum.peaks).toStrictEqual([]);
    irSpectrum.peakPicking(3);
    expect(irSpectrum.peaks).toStrictEqual([
      {
        absorbance: 0.3010299956639812,
        kind: 'm',
        transmittance: 0.5,
        wavelength: 3
      }
    ]);
  });

  it('large range', () => {
    let irSpectrum = fromText(text);

    irSpectrum.peaks = [];
    irSpectrum.peakPicking(3, { range: 10 });
    expect(irSpectrum.peaks).toStrictEqual([
      {
        absorbance: 0.6989700043360187,
        kind: 'S',
        transmittance: 0.2,
        wavelength: 6
      }
    ]);
  });

  it('small range', () => {
    let irSpectrum = fromText(text);

    irSpectrum.peaks = [];
    irSpectrum.peakPicking(4, { range: 1 });
    expect(irSpectrum.peaks).toStrictEqual([
      {
        absorbance: 0.3010299956639812,
        kind: 'm',
        transmittance: 0.5,
        wavelength: 3
      }
    ]);
  });

  it('test optimize', () => {
    let irSpectrum = fromText(text);

    irSpectrum.peakPicking(7, { optimize: true });
    irSpectrum.peakPicking(1, { optimize: true });
    expect(irSpectrum.peaks).toStrictEqual([
      {
        absorbance: 0.6989700043360187,
        kind: 'S',
        transmittance: 0.2,
        wavelength: 6
      },
      {
        absorbance: 0.3010299956639812,
        kind: 'm',
        transmittance: 0.5,
        wavelength: 3
      }
    ]);
  });

  it('test duplicate', () => {
    let irSpectrum = fromText(text);

    irSpectrum.peakPicking(3, { range: 1 });
    irSpectrum.peakPicking(3, { optimize: true });
    expect(irSpectrum.peaks).toStrictEqual([
      {
        absorbance: 0.3010299956639812,
        kind: 'm',
        transmittance: 0.5,
        wavelength: 3
      }
    ]);
  });
});
