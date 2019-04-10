/**
 *
 * @param {Spectrum} spectrum
 * @param {object} peak
 */

export function addPeak(spectrum, peak = {}) {
  if (!peak.wavelength) {
    throw new Error('addPeak: peak mush have wavelength property');
  }
  if (!peak.absorbance && !peak.transmittance) {
    throw new Error(
      'addPeak: peak mush have either absorbance of transmittance property'
    );
  }
  const {
    wavelength,
    transmittance = 10 ** -peak.absorbance,
    absorbance = -Math.log10(peak.transmittance)
  } = peak;

  for (let existing of spectrum.peaks) {
    if (Number(existing.wavelength) === wavelength) return existing;
  }
  spectrum.peaks.push({
    wavelength: wavelength,
    transmittance: transmittance,
    absorbance: absorbance,
    kind: getPeakKind(
      transmittance,
      spectrum.minTransmittance,
      spectrum.maxTransmittance
    )
  });
  return peak;
}

function getPeakKind(transmittance, minTransmittance, maxTransmittance) {
  var position =
    (maxTransmittance - transmittance) / (maxTransmittance - minTransmittance);
  if (position < 0.33) {
    return 'w';
  } else if (position < 0.66) {
    return 'm';
  }
  return 'S';
}
