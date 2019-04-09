import { createAction } from 'typesafe-actions';
import { Dispatch } from 'redux';

import { getBrowserAnalyticsObject } from 'src/analyticsHelper';

export const updateSelectedPreFilters = createAction(
  'custom-download/update-selected-pre-filters',
  (resolve) => {
    return (preFilterStatuses: any) =>
      resolve(preFilterStatuses, getBrowserAnalyticsObject('Default Action'));
  }
);
