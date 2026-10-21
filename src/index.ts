import { JSGraph as OriginalJSGraph } from 'common-spectrum';

import { getAnnotations } from './jsgraph/getAnnotations.ts';

export {
  AnalysesManager,
  Analysis,
  autoPeakPicking,
  peakPicking,
  toJcamp,
  toMatrix,
  toText,
} from 'common-spectrum';

export type { FromOptions } from './from/from.ts';
export { from } from './from/from.ts';
export { fromCaryEclipseCSV } from './from/fromCaryEclipseCSV.ts';
export { fromJcamp } from './from/fromJcamp.ts';
export { fromSP } from './from/fromSP.ts';
export { fromSPC } from './from/fromSPC.ts';
export { fromText } from './from/fromText.ts';

export const JSGraph: typeof OriginalJSGraph & {
  getAnnotations: typeof getAnnotations;
} = { ...OriginalJSGraph, getAnnotations };
