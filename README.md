# uv-spectrum

[![NPM version][npm-image]][npm-url]
[![Test coverage][codecov-image]][codecov-url]
[![npm download][download-image]][download-url]

Parse and process UV-Vis absorption spectra. The package wraps [`common-spectrum`](https://github.com/cheminfo/common-spectrum) with UV-specific variable derivation and ships readers for JCAMP-DX, plain-text two-column data, and Cary Eclipse CSV files.

## Installation

`$ npm install --save uv-spectrum`

## Usage

```js
import { fromJcamp } from 'uv-spectrum';

const analysis = fromJcamp(jcamp);
```

Other readers exposed by the package: `fromText` and `fromCaryEclipseCSV`. Core helpers re-exported from `common-spectrum` (`Analysis`, `AnalysesManager`, `autoPeakPicking`, `peakPicking`, `toJcamp`, `toMatrix`, `toText`) are also importable from `uv-spectrum`.

When loading a UV-Vis spectrum, additional variables are derived from the y axis depending on its label:

### Absorbance / transmittance input

| Key | Label              | Units | Description                                                |
| --- | ------------------ | ----- | ---------------------------------------------------------- |
| x   | Wavelength         | nm    | Wavelength from the source file                            |
| y   | (from source file) |       | Original y-axis data                                       |
| a   | Absorbance         |       | Absorbance values (computed from transmittance if needed)  |
| t   | Transmittance (%)  |       | Percent transmittance (computed from absorbance if needed) |

The conversion is automatic: if the y label contains "transmittance", absorbance is computed as `-log10(T / factor)`; if it contains "absorbance", transmittance is computed as `10^(-A) * 100`. For transmittance, the presence of `%` or `percent` in the label determines whether the input is already scaled to `0-100` or `0-1`.

### Reflectance input

When the y label contains "reflect", reflectance-derived quantities are added instead:

| Key | Label                            | Units           | Description                                              |
| --- | -------------------------------- | --------------- | -------------------------------------------------------- |
| x   | Wavelength                       | nm              | Wavelength from the source file                          |
| y   | (from source file)               |                 | Original reflectance data                                |
| r   | Reflectance                      |                 | Copy of the original reflectance values                  |
| k   | F(R)                             |                 | Kubelka-Munk function: `(1 - R)^2 / (2 R)`               |
| e   | Energy                           | eV              | Photon energy converted from wavelength                  |
| c   | `(F(R) / 100 * h * v / e)^(1/2)` | Arbitrary units | Tauc plot quantity (direct-allowed transition, factor 2) |

## [API Documentation](https://cheminfo.github.io/uv-spectrum/)

## License

[MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/uv-spectrum.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/uv-spectrum
[codecov-image]: https://img.shields.io/codecov/c/github/cheminfo/uv-spectrum.svg?style=flat-square
[codecov-url]: https://codecov.io/gh/cheminfo/uv-spectrum
[download-image]: https://img.shields.io/npm/dm/uv-spectrum.svg?style=flat-square
[download-url]: https://www.npmjs.com/package/uv-spectrum
