/**
 * See the NOTICE file distributed with this work for additional information
 * regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { combineReducers } from 'redux';

import entityViewerPageMetaReducer from './pageMeta/entityViewerPageMetaSlice';
import entityViewerGeneralReducer from './general/entityViewerGeneralSlice';
import entityViewerSidebarReducer from './sidebar/entityViewerSidebarSlice';
import entityViewerGeneViewReducer from './gene-view/entityViewerGeneViewReducer';
import entityViewerBookmarksReducer from './bookmarks/entityViewerBookmarksSlice';

export default combineReducers({
  pageMeta: entityViewerPageMetaReducer,
  general: entityViewerGeneralReducer,
  sidebar: entityViewerSidebarReducer,
  geneView: entityViewerGeneViewReducer,
  bookmarks: entityViewerBookmarksReducer
});
