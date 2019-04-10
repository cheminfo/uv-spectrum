export const ABSORBANCE = 1;
export const TRANSMITTANCE = 2;
export const PERCENT_TRANSMITTANCE = 3;

export function getKind(kind = '') {
  if (typeof kind === 'number') {
    if (kind < 1 || kind > 2) {
      throw new Error('kind should either be 1 or 2');
    }
    return kind;
  }
  if (kind.match(/abs/i)) {
    return ABSORBANCE;
  }
  return TRANSMITTANCE;
}
