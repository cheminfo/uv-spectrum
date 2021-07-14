/**
 * @typedef {Object} Peak
 * @property {number} wavenumber
 * @property {number} transmittance
 * @property {number} intensity
 * @property {number} kind
 * @property {number} assignment
 */

/**
 * Creates annotations for jsgraph that allows to display the result of peak picking
 * @param {array<Peak>} peaks
 * @param {object} [options={}]
 * @param {string} [options.fillColor='green']
 * @param {string} [options.strokeColor='red']
 * @param {string} [options.showKind=true] Display the kind, 'm', 'w', 'S'
 * @param {string} [options.showAssignment=true] Display the assignment
 * @param {function} [options.createFct] (annotation, peak) => {}: callback allowing to add properties
 * @returns array
 */

export function getAnnotations(peaks, options = {}) {
  const {
    fillColor = 'green',
    strokeColor = 'red',
    creationFct,
  } = options;
  let annotations = peaks.map((peak) => {
    let annotation = {
      line: 1,
      type: 'rect',
      strokeColor: strokeColor,
      strokeWidth: 0,
      fillColor: fillColor,
    };
    if (creationFct) {
      creationFct(annotation, peak);
    }
        annotationAbsorbance(annotation, peak, options);
    return annotation;
  });
  return annotations;
}

function annotationAbsorbance(annotation, peak, options = {}) {
  const {
    showKind = true,
    showAssignment = true,
    assignmentAngle = -45,
  } = options;
  let labels = [];
  let line = 0;

  if (showKind) {
    labels.push({
      text: peak.kind,
      size: '18px',
      anchor: 'middle',
      color: 'red',
      position: {
        x: peak.wavenumber,
        y: peak.intensity,
        dy: `${-15 - line * 14}px`,
      },
    });
    line++;
  }

  if (showAssignment) {
    labels.push({
      text: peak.assignment,
      size: '18px',
      angle: assignmentAngle,
      anchor: 'left',
      color: 'darkred',
      position: {
        x: peak.wavenumber,
        y: peak.intensity,
        dy: `${-15 - line * 14}px`,
      },
    });
    line++;
  }

  annotation.labels = labels;

  annotation.position = [
    {
      x: peak.wavenumber,
      y: peak.intensity,
      dy: '-10px',
      dx: '-1px',
    },
    {
      x: peak.wavenumber,
      y: peak.intensity,
      dy: '-5px',
      dx: '1px',
    },
  ];
}
