const H = 6.62607015e-34; // Planck quantum (J / s)
const E = 1.60217663e-19; // elementary charge (C)
const C = 299792458; // speed of light (m / s)

export function spectrumCallback(variables) {
  // we add missing absorbance / transmittance
  // variable a = absorbance
  // variable t = transmittance
  // variable r = reflectance
  // variable k = Kubelka-Munk Function

  if (variables.y.label.toLowerCase().includes('reflect')) {
    parseReflectance(variables);
  } else {
    parseAbsorbance(variables);
  }
}

function parseReflectance(variables) {
  const yVariable = variables.y;
  variables.r = { ...yVariable, symbol: 'r', data: yVariable.data.slice() };

  // Kubelka-Munk Function (KMF)
  variables.k = {
    data: variables.r.data.map((reflectance) => {
      const absolute = reflectance / 100;
      return (1 - absolute) ** 2 / (2 * absolute);
    }),
    symbol: 'k',
    label: ' F(R)',
    units: '',
  };

  variables.e = {
    data: variables.x.data.map((wavelength) => {
      const frequency = C / (wavelength * 1e-9);
      const energyJ = frequency * H;
      const energyEV = energyJ / E;
      return energyEV;
    }),
    symbol: 'e',
    label: 'Energy',
    units: 'eV',
  };

  variables.c = {
    symbol: 'c',
    label: '(F(R) / 100 * h * v / e)^1/2', // factor 2 is a specific case
    units: 'Arbitrary units',
    data: [],
  };
  for (let i = 0; i < variables.k.data.length; i++) {
    const frequency = C / (variables.x.data[i] * 1e-9);
    const kmf = variables.k.data[i];
    const factor = 2;
    const tauc = (kmf / 100 * H * frequency / E) ** (1 / factor);
    variables.c.data.push(tauc);
  }
}

function parseAbsorbance(variables) {
  const yVariable = variables.y;
  let absorbance = true;
  if (yVariable.label.toLowerCase().includes('trans')) {
    absorbance = false;
  }
  if (absorbance) {
    variables.a = { ...yVariable, symbol: 'a', data: yVariable.data.slice() };
    variables.t = {
      data: yVariable.data.map((absorbance) => 10 ** -absorbance * 100),
      label: 'Transmittance (%)',
      symbol: 't',
      units: '',
    };
  } else {
    const factor =
      yVariable.label.includes('%') ||
        yVariable.label.toLowerCase().includes('percent')
        ? 100
        : 1;

    variables.a = {
      data: yVariable.data.map(
        (transmittance) => -Math.log10(transmittance / factor),
      ),
      symbol: 'a',
      label: 'Absorbance',
      units: '',
    };
    if (factor === 100) {
      variables.t = { ...yVariable, symbol: 't' };
      variables.t.data = variables.t.data.slice();
    } else {
      variables.t = {
        units: '',
        label: 'Transmittance (%)',
        symbol: 't',
        data: yVariable.data.map((transmittance) => transmittance * 100),
      };
    }
  }
}
