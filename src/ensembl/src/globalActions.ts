import { createAction } from 'typesafe-actions';
import {
  BreakpointWidth,
  AnalyticsCategory,
  AnalyticsLabel
} from './globalConfig';
import { getAnalyticsFactory } from './globalHelper';

const getAnalyticsObject = getAnalyticsFactory(AnalyticsCategory.GLOBAL);

export const updateBreakpointWidth = createAction(
  'browser/update-breakpoint-width',
  (resolve) => {
    return (breakpointWidth: BreakpointWidth) =>
      resolve(breakpointWidth, getAnalyticsObject(AnalyticsLabel.DEFAULT));
  }
);
