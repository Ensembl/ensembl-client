export const assetsUrl = '/static';
export const imgBaseUrl = `${assetsUrl}/img`;

export enum BreakpointWidth {
  SMALL = 0,
  MEDIUM = 900,
  LARGE = 1400
}

export function getBreakpoint(width: number): BreakpointWidth {
  if (width > BreakpointWidth.LARGE) {
    return BreakpointWidth.LARGE;
  } else if (width > BreakpointWidth.MEDIUM) {
    return BreakpointWidth.MEDIUM;
  } else {
    return BreakpointWidth.SMALL;
  }
}
