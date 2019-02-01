import { combineReducers } from 'redux';
import { StateType } from 'typesafe-actions';

import header from './headerReducer';
import browser from './browserReducer';

const rootReducer = combineReducers({ header, browser });

export type RootState = StateType<typeof rootReducer>;
export default rootReducer;
