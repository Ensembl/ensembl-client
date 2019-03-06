import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import reducers from './rootReducer';

import ReactGA from 'react-ga';

ReactGA.initialize('UA-58710484-17');

const composeEnhancers = composeWithDevTools({});

const googleAnalyticsMiddleWare = (store: any) => (next: any) => (
  action: any
) => {
  try {
    // If we have the google anlytics meta data passed in, and
    // if disable_ga_tracking flag is not set to true,
    // We need to track this event
    if (!action.meta.ga.disable_tracking && action.meta.ga.category.length) {
      // The action and category fields are mandatory
      ReactGA.event({
        action: action.type,
        category: action.meta.ga.category,
        label: action.meta.ga.label,
        value: action.meta.ga.value,
        nonInteraction: action.meta.ga.nonInteraction
      });
    }
  } catch {
    console.warn(
      `Google Analytics meta data not correctly defined for the action: ${
        action.type
      }. \n Please define the meta data or pass 'meta.ga.disable_tracking = true' to disable tracking.`
    );
  }

  next(action);
};

export default createStore(
  reducers,
  composeEnhancers(applyMiddleware(thunk, googleAnalyticsMiddleWare))
);
