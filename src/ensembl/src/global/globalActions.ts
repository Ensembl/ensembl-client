import { createAction } from 'typesafe-actions';

import { BreakpointWidth } from './globalConfig';

export const updateBreakpointWidth = createAction(
  'browser/update-breakpoint-width',
  (resolve) => {
    return (breakpointWidth: BreakpointWidth) => resolve(breakpointWidth);
  }
);
