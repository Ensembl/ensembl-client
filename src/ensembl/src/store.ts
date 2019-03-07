import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createBrowserHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';
import reducers from './rootReducer';

import GoogleAnalyticsTracking from './services/analytics-service';

export const history = createBrowserHistory();

const composeEnhancers = composeWithDevTools({});

const googleAnalyticsMiddleWare = (store: any) => (next: any) => (
  action: any
) => {
  // If we have the google anlytics meta data passed in
  // We need to track this event
  if (action.meta && action.meta.ga && action.meta.ga.category) {
    // The action and category fields are mandatory
    GoogleAnalyticsTracking.trackEvent(action);
  } else if (action.type.indexOf('LOCATION_CHANGE') != -1) {
    // If the location history has been changed, track it as a pageview
    GoogleAnalyticsTracking.trackPageView(
      action.payload.location.pathname +
        action.payload.location.search +
        action.payload.location.hash
    );
  }

  next(action);
};

export default function configureStore(preloadedState?: any) {
  const store = createStore(
    reducers(history), // root reducer with router state
    preloadedState,
    composeEnhancers(
      applyMiddleware(
        routerMiddleware(history),
        thunk,
        googleAnalyticsMiddleWare
      )
    )
  );

  return store;
}
