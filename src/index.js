import { JSGraph as OriginalJSGraph } from 'common-spectrum';

import { getAnnotations } from './jsgraph/getAnnotations';

export {
  Analysis,
  AnalysesManager,
  toJcamp,
  peakPicking,
  autoPeakPicking,
  fromJcamp,
  fromText,
} from 'common-spectrum';

export const JSGraph = { ...OriginalJSGraph, getAnnotations };
