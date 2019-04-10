import equallySpaced from 'ml-array-xy-equally-spaced';
import Util from 'ml-array-utils';

export function getNormalized(spectrum, options = {}) {
  const {
    from = 800,
    to = 4000,
    numberOfPoints = 1000,
    applySNV = true
  } = options;
  let y = applySNV ? Util.SNV(spectrum.absorbance) : spectrum.absorbance;
  return equallySpaced(
    { x: spectrum.wavelength, y },
    { from, to, numberOfPoints }
  );
}
