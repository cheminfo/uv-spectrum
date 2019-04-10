import { addPeak } from './addPeak';

/**
 *
 * @param {Spectrum} spectrum
 * @param {number} targetWavelength
 * @param {object} [options]
 * @param {number} [options.range=0] Search in a range around the targetWavelength
 * @param {boolean} [options.optimize=false] Search for the closest peak to the targetWavelength
 */

export function peakPicking(spectrum, targetWavelength, options = {}) {
  const { range = 0, optimize = false } = options;

  // find the peak that is the closest to the click
  let bestPeak = getClosest(spectrum, targetWavelength);

  if (optimize) {
    findClosest(spectrum, bestPeak);
  } else if (range) {
    bestInRange(spectrum, bestPeak, targetWavelength, range);
  }

  return addPeak(spectrum, bestPeak);
}

function getClosest(spectrum, targetWavelength) {
  let bestPeak = {
    transmittance: spectrum.transmittance[0],
    absorbance: spectrum.absorbance[0],
    wavelength: spectrum.wavelength[0],
    index: 0
  };

  let error = Math.abs(targetWavelength - bestPeak.wavelength);
  for (let i = 1; i < spectrum.wavelength.length; i++) {
    let newError = Math.abs(targetWavelength - spectrum.wavelength[i]);
    if (newError < error) {
      error = newError;
      setBestPeak(spectrum, bestPeak, i);
    }
  }
  return bestPeak;
}

function bestInRange(spectrum, bestPeak, targetWavelength, range) {
  // we search the minimum based on wavelength +/- range
  for (let i = 0; i < spectrum.wavelength.length; i++) {
    if (Math.abs(spectrum.wavelength[i] - targetWavelength) <= range) {
      if (spectrum.transmittance[i] < bestPeak.transmittance) {
        setBestPeak(spectrum, bestPeak, i);
      }
    }
  }
}

function findClosest(spectrum, bestPeak) {
  let index = bestPeak.index;
  let previousIndex;
  while (index !== previousIndex) {
    previousIndex = index;
    if (index > 0 && spectrum.absorbance[index - 1] > bestPeak.absorbance) {
      index--;
      setBestPeak(spectrum, bestPeak, index);
    } else if (
      index < spectrum.wavelength.length - 1 &&
      spectrum.absorbance[index + 1] > bestPeak.absorbance
    ) {
      index++;
      setBestPeak(spectrum, bestPeak, index);
    }
  }
}

function setBestPeak(spectrum, bestPeak, index) {
  bestPeak.index = index;
  bestPeak.wavelength = spectrum.wavelength[index];
  bestPeak.absorbance = spectrum.absorbance[index];
  bestPeak.transmittance = spectrum.transmittance[index];
}
