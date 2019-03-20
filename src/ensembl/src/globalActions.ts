import { createAction } from 'typesafe-actions';
import { BreakpointWidth } from './globalConfig';
import { getGlobalAnalyticsObject } from './analyticsHelper';

export const updateBreakpointWidth = createAction(
  'browser/update-breakpoint-width',
  (resolve) => {
    return (breakpointWidth: BreakpointWidth) =>
      resolve(
        breakpointWidth,
        getGlobalAnalyticsObject({ label: 'Default Action' })
      );
  }
);
