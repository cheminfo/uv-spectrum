import { PERCENT_TRANSMITTANCE } from './constants';

export class Spectra {
  constructor(options = {}) {
    this.from = options.from === undefined ? 800 : options.from;
    this.to = options.to === undefined ? 4000 : options.to;
    this.numberOfPoints =
      options.numberOfPoints === undefined ? 1000 : options.numberOfPoints;
    this.applySNV = options.applySNV === undefined ? true : options.applySNV;
    this.data = [];
    this.mode = PERCENT_TRANSMITTANCE;
  }

  /**
   * Add a spectrum
   * @param {Spectrum} spectrum
   * @param {string} id
   * @param {object} [meta={}]
   * @param {string} [meta.color]
   */
  addSpectrum(spectrum, id, meta = {}) {
    let index = this.getSpectrumIndex(id);
    if (index === undefined) index = this.data.length;
    this.data[index] = {
      normalized: spectrum.getNormalized(spectrum, {
        from: this.from,
        to: this.to,
        numberOfPoints: this.numberOfPoints
      }),
      spectrum,
      id,
      meta
    };
  }

  removeSpectrum(id) {
    let index = this.getSpectrumIndex(id);
    if (index === undefined) return undefined;
    return this.data.splice(index, 1);
  }

  getSpectrumIndex(id) {
    if (!id) return undefined;
    for (let i = 0; i < this.data.length; i++) {
      let spectrum = this.data[i];
      if (spectrum.id === id) return i;
    }
    return undefined;
  }

  getNormalizedData() {
    if (!this.data || !this.data[0]) return {};
    let matrix = [];
    let meta = [];
    let ids = [];
    for (let datum of this.data) {
      ids.push(datum.id);
      matrix.push(datum.normalized.y);
      meta.push(datum.meta);
    }
    let x = this.data[0].normalized.x;
    return { ids, matrix, meta, x };
  }
}
