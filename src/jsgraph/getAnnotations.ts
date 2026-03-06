interface Peak {
  wavelength: number;
  absorbance: number;
  kind: string;
  assignment: string;
}

interface AnnotationLabel {
  text: string;
  size: string;
  anchor: string;
  color: string;
  angle?: number;
  position: {
    x: number;
    y: number;
    dy: string;
  };
}

interface Annotation {
  line: number;
  type: string;
  strokeColor: string;
  strokeWidth: number;
  fillColor: string;
  labels: AnnotationLabel[];
  position: Array<{ x: number; y: number; dy: string; dx: string }>;
}

interface GetAnnotationsOptions {
  fillColor?: string;
  strokeColor?: string;
  showKind?: boolean;
  showAssignment?: boolean;
  assignmentAngle?: number;
  creationFct?: (annotation: Annotation, peak: Peak) => void;
}

/**
 * Creates annotations for jsgraph to display peak picking results.
 * @param peaks - Array of peaks with wavelength, absorbance, kind, and assignment.
 * @param options - Display options for the annotations.
 * @returns Array of annotation objects for jsgraph.
 */
export function getAnnotations(
  peaks: Peak[],
  options: GetAnnotationsOptions = {},
): Annotation[] {
  const { fillColor = 'green', strokeColor = 'red', creationFct } = options;
  const annotations = peaks.map((peak) => {
    const annotation: Annotation = {
      line: 1,
      type: 'rect',
      strokeColor,
      strokeWidth: 0,
      fillColor,
      labels: [],
      position: [],
    };
    if (creationFct) {
      creationFct(annotation, peak);
    }
    annotationAbsorbance(annotation, peak, options);
    return annotation;
  });
  return annotations;
}

function annotationAbsorbance(
  annotation: Annotation,
  peak: Peak,
  options: GetAnnotationsOptions = {},
) {
  const {
    showKind = true,
    showAssignment = true,
    assignmentAngle = -45,
  } = options;
  const labels: AnnotationLabel[] = [];
  let line = 0;

  if (showKind) {
    labels.push({
      text: peak.kind,
      size: '18px',
      anchor: 'middle',
      color: 'red',
      position: {
        x: peak.wavelength,
        y: peak.absorbance,
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
        x: peak.wavelength,
        y: peak.absorbance,
        dy: `${-15 - line * 14}px`,
      },
    });
    line++;
  }

  annotation.labels = labels;

  annotation.position = [
    {
      x: peak.wavelength,
      y: peak.absorbance,
      dy: '-10px',
      dx: '-1px',
    },
    {
      x: peak.wavelength,
      y: peak.absorbance,
      dy: '-5px',
      dx: '1px',
    },
  ];
}
