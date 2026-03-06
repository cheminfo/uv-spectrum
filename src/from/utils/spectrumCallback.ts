import type { MeasurementXYVariables } from 'cheminfo-types';

const PLANCK_CONSTANT = 6.62607015e-34; // Planck quantum (J / s)
const ELEMENTARY_CHARGE = 1.60217663e-19; // elementary charge (C)
const SPEED_OF_LIGHT = 299792458; // speed of light (m / s)

/**
 * Callback applied to spectrum variables to compute derived UV quantities.
 * Adds absorbance/transmittance or reflectance-derived variables depending on the Y label.
 * @param variables - The spectrum variables with at least x and y.
 */
export function spectrumCallback(variables: MeasurementXYVariables) {
  if (variables.y.label?.toLowerCase().includes('reflect')) {
    parseReflectance(variables);
  } else {
    parseAbsorbance(variables);
  }
}

function parseReflectance(variables: MeasurementXYVariables) {
  const yData = Array.from(variables.y.data);
  const xData = Array.from(variables.x.data);

  variables.r = {
    ...variables.y,
    symbol: 'r',
    data: yData.slice(),
  };

  // Kubelka-Munk Function (KMF)
  const kmfData = yData.map((reflectance) => {
    const absolute = reflectance / 100;
    return (1 - absolute) ** 2 / (2 * absolute);
  });

  variables.k = {
    data: kmfData,
    symbol: 'k',
    label: ' F(R)',
    units: '',
  };

  variables.e = {
    data: xData.map((wavelength) => {
      const frequency = SPEED_OF_LIGHT / (wavelength * 1e-9);
      const energyJ = frequency * PLANCK_CONSTANT;
      return energyJ / ELEMENTARY_CHARGE;
    }),
    symbol: 'e',
    label: 'Energy',
    units: 'eV',
  };

  const taucData: number[] = [];
  for (let i = 0; i < kmfData.length; i++) {
    const wavelength = xData[i] as number;
    const frequency = SPEED_OF_LIGHT / (wavelength * 1e-9);
    const kmf = kmfData[i] as number;
    const factor = 2;
    const tauc =
      (((kmf / 100) * PLANCK_CONSTANT * frequency) / ELEMENTARY_CHARGE) **
      (1 / factor);
    taucData.push(tauc);
  }

  variables.c = {
    symbol: 'c',
    label: '(F(R) / 100 * h * v / e)^1/2', // factor 2 is a specific case
    units: 'Arbitrary units',
    data: taucData,
  };
}

function parseAbsorbance(variables: MeasurementXYVariables) {
  const yVariable = variables.y;
  const yData = Array.from(yVariable.data);
  let isAbsorbance = true;
  if (yVariable.label?.toLowerCase().includes('trans')) {
    isAbsorbance = false;
  }
  if (isAbsorbance) {
    variables.a = { ...yVariable, symbol: 'a', data: yData.slice() };
    variables.t = {
      data: yData.map((value) => 10 ** -value * 100),
      label: 'Transmittance (%)',
      symbol: 't',
      units: '',
    };
  } else {
    const factor =
      yVariable.label?.includes('%') ||
      yVariable.label?.toLowerCase().includes('percent')
        ? 100
        : 1;

    variables.a = {
      data: yData.map((transmittance) => -Math.log10(transmittance / factor)),
      symbol: 'a',
      label: 'Absorbance',
      units: '',
    };
    if (factor === 100) {
      variables.t = { ...yVariable, symbol: 't', data: yData.slice() };
    } else {
      variables.t = {
        units: '',
        label: 'Transmittance (%)',
        symbol: 't',
        data: yData.map((transmittance) => transmittance * 100),
      };
    }
  }
}
