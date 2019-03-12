import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createBrowserHistory } from 'history';
import { routerMiddleware, LOCATION_CHANGE } from 'connected-react-router';
import { StateType } from 'typesafe-actions';

import createRootReducer from './rootReducer';

import GoogleAnalyticsTracking from './services/analytics-service';

const googleAnalyticsMiddleWare = (store: any) => (next: any) => (
  action: any
) => {
  // If we have the google anlytics meta data passed in
  // We need to track this event
  if (action.meta && action.meta.ga && action.meta.ga.category) {
    // The action and category fields are mandatory
    GoogleAnalyticsTracking.trackEvent(action);
  } else if (
    action.type === LOCATION_CHANGE &&
    action.payload.location.pathname !==
      store.getState().router.location.pathname
  ) {
    // If the location history has been changed, track it as a pageview
    GoogleAnalyticsTracking.trackPageView(
      action.payload.location.pathname +
        action.payload.location.search +
        action.payload.location.hash
    );
  }

  next(action);
};

export const history = createBrowserHistory();
const composeEnhancers = composeWithDevTools({});

const rootReducer = createRootReducer(history);

export type RootState = StateType<typeof rootReducer>;

export default function configureStore(preloadedState?: any) {
  const store = createStore(
    rootReducer,
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
