import { BreakpointWidth } from './globalConfig';

export type GlobalState = Readonly<{
  breakpointWidth: BreakpointWidth;
}>;

export const defaultState: GlobalState = {
  breakpointWidth: BreakpointWidth.DESKTOP
};
