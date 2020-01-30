import { combineReducers } from 'redux';

import entityViewerGeneralReducer from './general/entityViewerGeneralReducer';
import entityViewerSidebarReducer from './sidebar/entityViewerSidebarReducer';

export default combineReducers({
  general: entityViewerGeneralReducer,
  sidebar: entityViewerSidebarReducer
});
