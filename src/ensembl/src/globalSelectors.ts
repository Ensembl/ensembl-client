import { RootState } from './rootReducer';
import { BreakpointWidth } from './globalConfig';

export const getBreakpointWidth = (state: RootState): BreakpointWidth =>
  state.global.breakpointWidth;
