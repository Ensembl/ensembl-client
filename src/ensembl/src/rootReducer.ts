import { combineReducers } from 'redux';
import { StateType } from 'typesafe-actions';

import header from './header/headerReducer';
import browser from './content/app/browser/browserReducer';

const rootReducer = combineReducers({ header, browser });

export type RootState = StateType<typeof rootReducer>;
export default rootReducer;
