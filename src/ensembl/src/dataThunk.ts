import { Dispatch } from 'redux';

import config from 'config';
import GoogleAnalyticsTracking from './services/analytics-service';
import { buildAnalyticsObject, AnalyticsCategory } from './analyticsHelper';

export const getDataThunk = (
  endpoint: string,
  asyncActions: any,
  analyticsCategory: AnalyticsCategory,
  id?: string
) => {
  return (dispatch: Dispatch) => {
    dispatch(asyncActions.request(id));

    const startTime = Date.now();

    return fetch(`${config.apiHost}${endpoint}`)
      .then(
        (response) => {
          const endTime = Date.now();
          const timeDiff = endTime - startTime;

          GoogleAnalyticsTracking.trackRequest(
            buildAnalyticsObject(analyticsCategory)({
              action: asyncActions.request.getType(),
              label: 'AJAX Request',
              value: timeDiff
            })
          );

          return response.json();
        },
        (error) => dispatch(asyncActions.failure(error))
      )
      .then((json) => dispatch(asyncActions.success(json)));
  };
};
