import { ABSORBANCE, TRANSMITTANCE, PERCENT_TRANSMITTANCE } from '../constants';

export function getAnnotations(spectrum, options = {}) {
  const { fillColor = 'green', strokeColor = 'red', creationFct } = options;
  const peaks = spectrum.peaks;
  if (!peaks) return [];
  let annotations = peaks.map((peak) => {
    var annotation = {
      line: 1,
      type: 'rect',
      strokeColor: strokeColor,
      strokeWidth: 0,
      fillColor: fillColor
    };
    if (creationFct) {
      creationFct(annotation, peak);
    }
    switch (spectrum.mode) {
      case ABSORBANCE:
        annotationAbsorbance(annotation, peak);
        break;
      case TRANSMITTANCE:
        annotationTransmittance(annotation, peak, 1);
        break;
      case PERCENT_TRANSMITTANCE:
        annotationTransmittance(annotation, peak, 100);
        break;
      default:
    }
    return annotation;
  });

  return annotations;
}

function annotationTransmittance(annotation, peak, factor = 1) {
  annotation.label = [
    {
      text: String(peak.wavelength),
      size: '12px',
      anchor: 'middle',
      color: 'red',
      position: {
        x: peak.wavelength,
        y: peak.transmittance * factor,
        dy: '23px'
      }
    }
  ];
  annotation.position = [
    {
      x: peak.wavelength,
      y: peak.transmittance * factor,
      dy: '10px',
      dx: '-1px'
    },
    {
      x: peak.wavelength,
      y: peak.transmittance * factor,
      dy: '5px',
      dx: '1px'
    }
  ];
}

function annotationAbsorbance(annotation, peak) {
  annotation.label = [
    {
      text: String(peak.wavelength),
      size: '18px',
      anchor: 'middle',
      color: 'red',
      position: {
        x: peak.wavelength,
        y: peak.absorbance,
        dy: '-15px'
      }
    }
  ];
  annotation.position = [
    {
      x: peak.wavelength,
      y: peak.absorbance,
      dy: '-10px',
      dx: '-1px'
    },
    {
      x: peak.wavelength,
      y: peak.absorbance,
      dy: '-5px',
      dx: '1px'
    }
  ];
}
