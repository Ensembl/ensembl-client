import { createStandardAction } from 'typesafe-actions';

import { BreakpointWidth } from './globalConfig';

export const updateBreakpointWidth = createStandardAction(
  'browser/update-breakpoint-width'
)<BreakpointWidth>();
