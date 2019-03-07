import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import reducers from './rootReducer';

import ReactGA from 'react-ga';

const composeEnhancers = composeWithDevTools({});

const googleAnalyticsMiddleWare = (store: any) => (next: any) => (
  action: any
) => {
  // If we have the google anlytics meta data passed in
  // We need to track this event
  if (action.meta && action.meta.ga && action.meta.ga.category) {
    // The action and category fields are mandatory
    ReactGA.event({
      action: action.meta.ga.action ? action.meta.ga.action : action.type,
      category: action.meta.ga.category,
      label: action.meta.ga.label,
      value: action.meta.ga.value,
      nonInteraction: action.meta.ga.nonInteraction
    });
  }

  next(action);
};

export default createStore(
  reducers,
  composeEnhancers(applyMiddleware(thunk, googleAnalyticsMiddleWare))
);
