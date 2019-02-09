import { combineReducers } from 'redux';
import { StateType } from 'typesafe-actions';

import global from './globalReducer';
import header from './header/headerReducer';
import browser from './content/app/browser/browserReducer';

const rootReducer = combineReducers({ global, header, browser });

export type RootState = StateType<typeof rootReducer>;
export default rootReducer;
