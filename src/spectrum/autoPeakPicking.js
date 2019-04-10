import { gsd } from 'ml-gsd';

import { addPeak } from './addPeak';
/**
 *
 * @param {*} spectrum
 * @param {object} [options={}]
 * @param {number} [options.fromWavelength=0]
 * @param {number} [options.toWavelength=5000]
 * @param {number} [options.noiseLevel=0.01] - Specify the level of the noise
 * @param {number} [options.minMaxRatio=0.05] - Threshold to determine if a given peak should be considered as a noise
 * @param {boolean} [options.replaceExisting=true] - Replace existing peaks
 */

export function autoPeakPicking(spectrum, options = {}) {
  const {
    noiseLevel = 0.001,
    minMaxRatio = 0.05,
    fromWavelength = 0,
    toWavelength = 5000,
    replaceExisting = true
  } = options;

  let peaks = gsd(spectrum.wavelength, spectrum.absorbance, {
    noiseLevel,
    minMaxRatio,
    realTopDetection: true,
    maxCriteria: true,
    smoothY: false,
    sgOptions: { windowSize: 7, polynomial: 3 }
  });

  peaks = peaks.filter(
    (peak) => peak.x >= fromWavelength && peak.x <= toWavelength
  );

  if (replaceExisting) {
    while (spectrum.peaks.length) {
      spectrum.peaks.pop();
    }
  }

  peakLoop: for (let peak of peaks) {
    for (let existing of spectrum.peaks) {
      if (Number(existing.wavelength) === Number(peak.x)) continue peakLoop;
    }
    addPeak(spectrum, {
      wavelength: peak.x,
      absorbance: peak.y
    });
  }
}
