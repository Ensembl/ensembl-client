import { BreakpointWidth, globalMediaQueries } from './globalConfig';
import { getCurrentMediaSize } from 'src/global/windowSizeHelpers';

export type GlobalState = Readonly<{
  breakpointWidth: BreakpointWidth;
}>;

// NOTE: this will be incompatible with server-side rendering; we will need to run this only on the client
const viewport = getCurrentMediaSize(
  globalMediaQueries
) as keyof typeof BreakpointWidth;

export const defaultState: GlobalState = {
  breakpointWidth: BreakpointWidth[viewport] || BreakpointWidth.DESKTOP
};
