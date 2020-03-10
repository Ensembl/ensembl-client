import { combineReducers } from 'redux';

import entityViewerGeneralReducer from './general/entityViewerGeneralReducer';
import entityViewerSidebarReducer from './sidebar/entityViewerSidebarReducer';
import entityViewerGeneReducer from './gene-view/entityViewerGeneReducer';

export default combineReducers({
  general: entityViewerGeneralReducer,
  sidebar: entityViewerSidebarReducer,
  gene: entityViewerGeneReducer
});
