import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { StateType } from 'typesafe-actions';

import global from './globalReducer';
import header from './header/headerReducer';
import browser from './content/app/browser/browserReducer';

const rootReducer = (history: any) =>
  combineReducers({
    browser,
    global,
    header,
    router: connectRouter(history)
  });

export type RootState = StateType<typeof rootReducer>;

export default rootReducer;
