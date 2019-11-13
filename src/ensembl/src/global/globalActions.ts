import { createAction } from 'typesafe-actions';

import { BreakpointWidth } from './globalConfig';

export const updateBreakpointWidth = createAction(
  'browser/update-breakpoint-width'
)<BreakpointWidth>();
