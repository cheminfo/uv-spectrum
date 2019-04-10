import min from 'ml-array-min';
import max from 'ml-array-max';

import { TRANSMITTANCE, ABSORBANCE, PERCENT_TRANSMITTANCE } from './constants';
import { toJSON } from './to/json';
import { getAnnotations } from './jsgraph/getAnnotations';
import { getData } from './jsgraph/getData';
import { peakPicking } from './spectrum/peakPicking';
import { autoPeakPicking } from './spectrum/autoPeakPicking';
import { getNormalized } from './spectrum/getNormalized';

/**
 * Class allowing manipulate one UV spectrum
 * @class spectrum
 * @param {object} [json={}] - object containing a spectrum
 * @param {Array} [json.wavelength=[]] - wavelength
 * @param {Array} [json.y=[]] - y values
 * @param {integer} [json.kind=spectrum.TRANSMITTANCE] - either spectrum.ABSORBANCE or spectrum.TRANSMITTANCE
 */
export class Spectrum {
  constructor(json = {}) {
    this.wavelength = json.wavelength || [];
    this.absorbance = json.absorbance || [];
    this.transmittance = json.transmittance || [];
    this.mode = PERCENT_TRANSMITTANCE;
    this.peaks = [];
    check(this);
  }

  /**
   *
   * @param {Array} [peaks=[]] array of peaks. Peaks are composed of transmittance, wavelength, kind
   */
  setPeaks(peaks = []) {
    this.peaks = peaks;
  }

  setMode(mode) {
    if (mode < 1 || mode > 3) {
      throw new Error(
        'Mode should be either 1 (absorbance), 2 (transmittance) or 3 (percent transmittance)'
      );
    }
    this.mode = mode;
  }

  peakPicking(targetWavelength, options = {}) {
    peakPicking(this, targetWavelength, options);
  }

  getAbsorbance() {
    return { x: this.wavelength, y: this.absorbance };
  }

  getTransmittance() {
    return { x: this.wavelength, y: this.transmittance };
  }

  getPercentTransmittance() {
    let data = this.getTransmittance();
    return {
      x: data.x,
      y: data.y.map(transmittance => transmittance * 100)
    };
  }

  getYLabel() {
    switch (this.mode) {
      case ABSORBANCE:
        return 'Absorbance';
      case TRANSMITTANCE:
        return 'Transmittance';
      case PERCENT_TRANSMITTANCE:
        return 'Transmittance [%]';
      default:
        return '';
    }
  }
}

Spectrum.prototype.toJSON = toJSON;
Spectrum.prototype.getAnnotations = function(options) {
  return getAnnotations(this, options);
};
Spectrum.prototype.getData = function(options) {
  return getData(this, options);
};
Spectrum.prototype.autoPeakPicking = function(options) {
  return autoPeakPicking(this, options);
};
Spectrum.prototype.getNormalized = function(options) {
  return getNormalized(this, options);
};

function check(spectrum) {
  if (spectrum.transmittance.length > 0 && spectrum.absorbance.length === 0) {
    spectrum.absorbance = spectrum.transmittance.map(
      transmittance => -Math.log10(transmittance)
    );
  }

  if (spectrum.absorbance.length > 0 && spectrum.transmittance.length === 0) {
    spectrum.transmittance = spectrum.absorbance.map(
      absorbance => 10 ** -absorbance
    );
  }

  if (spectrum.wavelength.length > 0) {
    spectrum.minWavelength = min(spectrum.wavelength);
  }
  if (spectrum.wavelength.length > 0) {
    spectrum.maxWavelength = max(spectrum.wavelength);
  }
  if (spectrum.absorbance.length > 0) {
    spectrum.minAbsorbance = min(spectrum.absorbance);
  }
  if (spectrum.absorbance.length > 0) {
    spectrum.maxAbsorbance = max(spectrum.absorbance);
  }
  if (spectrum.transmittance.length > 0) {
    spectrum.minTransmittance = min(spectrum.transmittance);
  }
  if (spectrum.transmittance.length > 0) {
    spectrum.maxTransmittance = max(spectrum.transmittance);
  }
}
