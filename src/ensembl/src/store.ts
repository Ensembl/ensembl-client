import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import reducers from './rootReducer';

const composeEnhancers = composeWithDevTools({});

export default createStore(reducers, composeEnhancers(applyMiddleware(thunk)));
