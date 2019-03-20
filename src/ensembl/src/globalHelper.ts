import { BreakpointWidth } from './globalConfig';

export const getBreakpoint = (width: number): BreakpointWidth => {
  if (width > BreakpointWidth.LARGE) {
    return BreakpointWidth.LARGE;
  } else if (width > BreakpointWidth.MEDIUM) {
    return BreakpointWidth.MEDIUM;
  } else {
    return BreakpointWidth.SMALL;
  }
};

export const getAnalyticsFactory = (category: string) => (label: string) => ({
  category,
  label
});
