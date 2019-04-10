/**
 * Create an object of Chromatogram
 * @return {object}
 */
export function toJSON() {
  return {
    wavelength: this.wavelength,
    transmittance: this.transmittance,
    peaks: this.peaks
  };
}
