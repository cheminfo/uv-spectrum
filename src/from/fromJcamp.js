import { fromJcamp as commonFromJcamp } from 'common-spectrum';

import { spectrumCallback } from './utils/spectrumCallback';

/**
 * Creates a new Analysis from a SPC buffer
 * @param {ArrayBuffer|string} jcamp
 * @param {object} [options={}]
 * @param {string|number} [options.id=Math.random()]
 * @param {string} [options.label=options.id] - human redeable label
 * @param {string} [options.spectrumCallback] - a callback to apply on variables when creating spectrum. Default will add a and t
 * @returns {Analysis} - New class element with the given data
 */
export function fromJcamp(jcamp, options = {}) {
  return commonFromJcamp(jcamp, { ...options, spectrumCallback });
}
