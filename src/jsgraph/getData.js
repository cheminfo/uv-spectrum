import { ABSORBANCE, TRANSMITTANCE, PERCENT_TRANSMITTANCE } from '../constants';

export function getData(spectrum) {
  switch (spectrum.mode) {
    case ABSORBANCE:
      return spectrum.getAbsorbance();
    case TRANSMITTANCE:
      return spectrum.getTransmittance();
    case PERCENT_TRANSMITTANCE:
      return spectrum.getPercentTransmittance();
    default:
      return {};
  }
}
