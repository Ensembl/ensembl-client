import { combineReducers } from 'redux';
import { StateType } from 'typesafe-actions';

import header from './headerReducer';

const rootReducer = combineReducers({ header });

export type RootState = StateType<typeof rootReducer>;
export default rootReducer;
