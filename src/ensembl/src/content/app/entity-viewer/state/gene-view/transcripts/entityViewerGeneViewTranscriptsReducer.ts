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

import { ActionType, getType } from 'typesafe-actions';
import merge from 'lodash/merge';
import get from 'lodash/get';

import {
  EntityViewerGeneViewTranscriptsUI,
  defaultTranscriptsUIState,
  initialTranscriptsUIState
} from './entityViewerGeneViewTranscriptsState';
import * as actions from './entityViewerGeneViewTranscriptsActions';

export default function entityViewerGeneViewTranscriptsReducer(
  state: EntityViewerGeneViewTranscriptsUI = initialTranscriptsUIState,
  action: ActionType<typeof actions>
) {
  switch (action.type) {
    case getType(actions.updateGeneViewTranscriptsUIState):
      const { activeGenomeId, activeObjectId, fragment } = action.payload;
      const oldStateFragment = get(
        state,
        `${activeGenomeId}.${activeObjectId}.contentUI.transcripts`,
        defaultTranscriptsUIState
      );
      const updatedStateFragment = merge({}, oldStateFragment, fragment);
      return {
        ...state,
        ...updatedStateFragment
      };
    default:
      return state;
  }
}
