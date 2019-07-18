import { LOCATION_CHANGE } from 'connected-react-router';

import analyticsTracking from './services/analytics-service';

export const analyticsMiddleWare = (store: any) => (next: any) => (
  action: any
) => {
  // If we have the google anlytics meta data passed in
  // We need to track this event
  if (action.meta && action.meta.ga && action.meta.ga.category) {
    // The action and category fields are mandatory
    analyticsTracking.trackEvent(action.meta.ga);
  } else if (
    action.type === LOCATION_CHANGE &&
    action.payload.location.pathname !==
      store.getState().router.location.pathname
  ) {
    // If the location history has been changed, track it as a pageview
    analyticsTracking.trackPageView(
      action.payload.location.pathname +
        action.payload.location.search +
        action.payload.location.hash
    );
  }

  next(action);
};
