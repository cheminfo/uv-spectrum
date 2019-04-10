# ir-spectrum

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![npm download][download-image]][download-url]

.

## Installation

`$ npm install --save ir-spectrum`

## Usage

```js
import IRSpectrum from 'ir-spectrum';

let spectrum = IRSpectrum.fromJcamp(jcamp);

// let spectrum = IRSpectrum.fromText(jcamp);

spectrum.setPeaks([]);

// if optimize is true, peak picking will find the best peak close to wavelength
spectrum.peakPicking(wavelength, { range: 0, optimize: true });
console.log(spectrum.peaks());

spectrum.autoPeakPicking({
  fromWavelength: 1500,
  toWavelength: 4000,
  noiseLvel: 0.01
});

// you may selecdt how you would like to retrieve the data
// there are 3 modes: ABSORBANCE, TRANSMITTANCE or PERCENT_TRANSMITTANCE
// those methods are very practical in coordination with www.jsgraph.org
spectrum.setMode(IRSpectrum.ABSORBANCE);
let annotations = spectrum.getAnnotations();
let data = spectrum.getData();
```

## [API Documentation](https://cheminfo.github.io/ir-spectrum/)

## License

[MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/ir-spectrum.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/ir-spectrum
[travis-image]: https://img.shields.io/travis/cheminfo/ir-spectrum/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/cheminfo/ir-spectrum
[codecov-image]: https://img.shields.io/codecov/c/github/cheminfo/ir-spectrum.svg?style=flat-square
[codecov-url]: https://codecov.io/gh/cheminfo/ir-spectrum
[download-image]: https://img.shields.io/npm/dm/ir-spectrum.svg?style=flat-square
[download-url]: https://www.npmjs.com/package/ir-spectrum
